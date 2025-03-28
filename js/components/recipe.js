// Filter recipes based on search and filters
function filterRecipes() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('category').value;
    const difficultyFilter = document.getElementById('difficulty').value;
    
    // Get all recipes
    const recipes = JSON.parse(localStorage.getItem('hospoHubRecipes') || '[]');
    
    // Apply filters
    const filteredRecipes = recipes.filter(recipe => {
        // Search term filter - search in multiple fields
        const matchesSearch = searchTerm === '' || 
            recipe.name.toLowerCase().includes(searchTerm) || 
            recipe.description.toLowerCase().includes(searchTerm) ||
            (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))) ||
            (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        // Category filter
        const matchesCategory = categoryFilter === '' || recipe.category === categoryFilter;
        
        // Difficulty filter
        const matchesDifficulty = difficultyFilter === '' || recipe.difficulty === difficultyFilter;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    // Display filtered recipes
    displayRecipes(filteredRecipes);
}

// View a recipe
function viewRecipe(recipeId) {
    // Get recipes
    const recipes = JSON.parse(localStorage.getItem('hospoHubRecipes') || '[]');
    
    // Find the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Format difficulty for display
    const difficultyColors = {
        'beginner': 'bg-green-100 text-green-800',
        'intermediate': 'bg-yellow-100 text-yellow-800',
        'advanced': 'bg-red-100 text-red-800'
    };
    
    const difficultyClass = difficultyColors[recipe.difficulty] || 'bg-gray-100 text-gray-800';
    
    // Format category
    const formattedCategory = recipe.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Format difficulty
    const formattedDifficulty = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    
    // Update modal with recipe details
    document.getElementById('view-recipe-title').textContent = recipe.name;
    document.getElementById('view-recipe-author').textContent = `By ${recipe.author || 'Unknown'}`;
    document.getElementById('view-recipe-date').textContent = `Added ${recipe.dateAdded || 'Unknown date'}`;
    document.getElementById('view-recipe-image').src = recipe.image;
    document.getElementById('view-recipe-image').alt = recipe.name;
    
    // Recipe category and difficulty badges
    const categoryEl = document.getElementById('view-recipe-category');
    categoryEl.textContent = formattedCategory;
    
    const difficultyEl = document.getElementById('view-recipe-difficulty');
    difficultyEl.textContent = formattedDifficulty;
    difficultyEl.className = `px-2 py-1 text-xs rounded-full ${difficultyClass}`;
    
    // Recipe dietary tags
    const dietaryTagsContainer = document.getElementById('view-recipe-dietary-tags');
    dietaryTagsContainer.innerHTML = '';
    
    if (recipe.dietaryInfo) {
        if (recipe.dietaryInfo.vegetarian) {
            addDietaryBadge(dietaryTagsContainer, 'Vegetarian', 'bg-green-100 text-green-800');
        }
        if (recipe.dietaryInfo.vegan) {
            addDietaryBadge(dietaryTagsContainer, 'Vegan', 'bg-green-100 text-green-800');
        }
        if (recipe.dietaryInfo.glutenFree) {
            addDietaryBadge(dietaryTagsContainer, 'Gluten-Free', 'bg-purple-100 text-purple-800');
        }
        if (recipe.dietaryInfo.dairyFree) {
            addDietaryBadge(dietaryTagsContainer, 'Dairy-Free', 'bg-blue-100 text-blue-800');
        }
    }
    
    // Recipe times
    document.getElementById('view-recipe-prep-time').textContent = `${recipe.prepTime || 0} min`;
    document.getElementById('view-recipe-cook-time').textContent = `${recipe.cookTime || 0} min`;
    
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    document.getElementById('view-recipe-total-time').textContent = `${totalTime} min`;
    
    // Recipe servings
    document.getElementById('view-recipe-servings').textContent = recipe.servings || 4;
    document.getElementById('view-recipe-yield').textContent = recipe.yield || `${recipe.servings || 4} servings`;
    
    // Recipe description
    document.getElementById('view-recipe-description').textContent = recipe.description || '';
    
    // Ingredients list
    const ingredientsList = document.getElementById('view-recipe-ingredients');
    ingredientsList.innerHTML = '';
    
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ingredient => {
            const div = document.createElement('div');
            div.className = 'flex items-start';
            div.innerHTML = `
                <input type="checkbox" class="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                <span class="ml-2 text-gray-600">${ingredient}</span>
            `;
            ingredientsList.appendChild(div);
        });
    }
    
    // Instructions list
    const instructionsList = document.getElementById('view-recipe-instructions');
    instructionsList.innerHTML = '';
    
    if (recipe.instructions && recipe.instructions.length > 0) {
        recipe.instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            li.className = 'mb-3';
            li.innerHTML = instruction;
            instructionsList.appendChild(li);
        });
    }
    
    // Notes
    const notesSection = document.getElementById('view-recipe-notes-section');
    const notesContent = document.getElementById('view-recipe-notes');
    
    if (recipe.notes && recipe.notes.trim()) {
        notesContent.textContent = recipe.notes;
        notesSection.classList.remove('hidden');
    } else {
        notesSection.classList.add('hidden');
    }
    
    // Tags
    const tagsSection = document.getElementById('view-recipe-tags-section');
    const tagsContainer = document.getElementById('view-recipe-tags');
    
    if (recipe.tags && recipe.tags.length > 0) {
        tagsContainer.innerHTML = '';
        recipe.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
        tagsSection.classList.remove('hidden');
    } else {
        tagsSection.classList.add('hidden');
    }
    
    // Nutritional info
    if (recipe.nutritionalInfo) {
        document.getElementById('nutrition-calories').textContent = recipe.nutritionalInfo.calories || 0;
        document.getElementById('nutrition-protein').textContent = `${recipe.nutritionalInfo.protein || 0}g`;
        document.getElementById('nutrition-carbs').textContent = `${recipe.nutritionalInfo.carbs || 0}g`;
        document.getElementById('nutrition-fat').textContent = `${recipe.nutritionalInfo.fat || 0}g`;
    }
    
    // Set recipe ID for action buttons
    document.getElementById('edit-recipe-button').dataset.recipeId = recipeId;
    if (document.getElementById('add-to-class-button')) {
        document.getElementById('add-to-class-button').dataset.recipeId = recipeId;
    }
    
    // Store current servings for scaling
    document.querySelector('#view-recipe-servings').dataset.originalServings = recipe.servings || 4;
    document.querySelector('#view-recipe-ingredients').dataset.originalServings = recipe.servings || 4;
    
    // Show modal
    document.getElementById('view-recipe-modal').classList.remove('hidden');
}

// Helper function to add dietary badge
function addDietaryBadge(container, text, colorClass) {
    const span = document.createElement('span');
    span.className = `px-2 py-1 text-xs rounded-full ${colorClass} ml-1`;
    span.textContent = text;
    container.appendChild(span);
}

// Close View Recipe Modal
function closeViewRecipeModal() {
    const modal = document.getElementById('view-recipe-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Edit a recipe
function editRecipe(recipeId) {
    // Get recipes
    const recipes = JSON.parse(localStorage.getItem('hospoHubRecipes') || '[]');
    
    // Find the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Open add recipe modal in edit mode
    openAddRecipeModal();
    
    // Switch to manual edit form
    showManualEntryForm();
    
    // Set form values from recipe
    document.getElementById('recipe-name').value = recipe.name || '';
    document.getElementById('recipe-category').value = recipe.category || 'main-courses';
    document.getElementById('recipe-difficulty').value = recipe.difficulty || 'intermediate';
    document.getElementById('recipe-prep-time').value = recipe.prepTime || 0;
    document.getElementById('recipe-cook-time').value = recipe.cookTime || 0;
    document.getElementById('recipe-servings').value = recipe.servings || 4;
    document.getElementById('recipe-yield').value = recipe.yield || '';
    document.getElementById('recipe-description').value = recipe.description || '';
    
    // Set ingredients and instructions
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        document.getElementById('recipe-ingredients').value = recipe.ingredients.join('\n');
    }
    
    if (recipe.instructions && recipe.instructions.length > 0) {
        document.getElementById('recipe-instructions').value = recipe.instructions.join('\n\n');
    }
    
    // Set notes and tags
    document.getElementById('recipe-notes').value = recipe.notes || '';
    
    if (recipe.tags && recipe.tags.length > 0) {
        document.getElementById('recipe-tags').value = recipe.tags.join(', ');
    }
    
    // Set dietary info checkboxes
    if (recipe.dietaryInfo) {
        document.getElementById('dietary-vegetarian').checked = recipe.dietaryInfo.vegetarian || false;
        document.getElementById('dietary-vegan').checked = recipe.dietaryInfo.vegan || false;
        document.getElementById('dietary-gluten-free').checked = recipe.dietaryInfo.glutenFree || false;
        document.getElementById('dietary-dairy-free').checked = recipe.dietaryInfo.dairyFree || false;
        document.getElementById('dietary-keto').checked = recipe.dietaryInfo.keto || false;
        document.getElementById('dietary-paleo').checked = recipe.dietaryInfo.paleo || false;
        document.getElementById('dietary-nut-free').checked = recipe.dietaryInfo.nutFree || false;
        document.getElementById('dietary-sugar-free').checked = recipe.dietaryInfo.sugarFree || false;
    }
    
    // Change modal title to Edit
    document.getElementById('modal-title').textContent = 'Edit Recipe';
    
    // Store the recipe ID for updating
    document.getElementById('save-recipe-button').dataset.recipeId = recipeId;
}

// Delete a recipe
function deleteRecipe(recipeId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }
    
    // Get recipes
    const recipes = JSON.parse(localStorage.getItem('hospoHubRecipes') || '[]');
    
    // Filter out the recipe to delete
    const updatedRecipes = recipes.filter(r => r.id !== recipeId);
    
    // Save to localStorage
    localStorage.setItem('hospoHubRecipes', JSON.stringify(updatedRecipes));
    
    // Refresh recipes display
    displayRecipes(updatedRecipes);
}

// Adjust recipe servings and ingredients
function adjustServings(action) {
    const servingsEl = document.getElementById('view-recipe-servings');
    const ingredientsContainer = document.getElementById('view-recipe-ingredients');
    
    if (!servingsEl || !ingredientsContainer) return;
    
    // Get current and original servings
    let currentServings = parseInt(servingsEl.textContent);
    const originalServings = parseInt(servingsEl.dataset.originalServings);
    
    // Adjust servings based on action
    if (action === 'decrease' && currentServings > 1) {
        currentServings--;
    } else if (action === 'increase') {
        currentServings++;
    } else {
        return;
    }
    
    // Update servings display
    servingsEl.textContent = currentServings;
    
    // Calculate scaling factor
    const scalingFactor = currentServings / originalServings;
    
    // Scale ingredient quantities
    const ingredientItems = ingredientsContainer.querySelectorAll('.flex.items-start');
    
    ingredientItems.forEach(item => {
        const textEl = item.querySelector('span');
        const originalText = textEl.dataset.original || textEl.textContent;
        
        // Store original text if not already stored
        if (!textEl.dataset.original) {
            textEl.dataset.original = originalText;
        }
        
        // Scale the ingredient quantity
        const scaledText = scaleIngredientQuantity(originalText, scalingFactor);
        textEl.textContent = scaledText;
    });
    
    // Update yield if available
    const yieldEl = document.getElementById('view-recipe-yield');
    if (yieldEl) {
        const originalYield = yieldEl.dataset.original || yieldEl.textContent;
        
        // Store original yield if not already stored
        if (!yieldEl.dataset.original) {
            yieldEl.dataset.original = originalYield;
        }
        
        // Update with scaled servings
        if (originalYield.includes('serving')) {
            yieldEl.textContent = `${currentServings} servings`;
        }
    }
}

// Scale ingredient quantity
function scaleIngredientQuantity(ingredient, factor) {
    // Regex to match common quantity patterns
    const quantityRegex = /^(\d+(\.\d+)?)(\/\d+)?\s*(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|g|gram|grams|kg|oz|ounce|ounces|lb|pound|pounds|ml|l|liter|liters)?/i;
    
    const match = ingredient.match(quantityRegex);
    
    if (match) {
        let quantity = match[1];
        const fraction = match[3];
        const unit = match[4] || '';
        
        // Convert quantity to number
        let numericQuantity = parseFloat(quantity);
        
        // Handle fractions
        if (fraction) {
            const [numerator, denominator] = fraction.substring(1).split('/');
            numericQuantity += parseInt(numerator) / parseInt(denominator);
        }
        
        // Scale the quantity
        const scaledQuantity = numericQuantity * factor;
        
        // Format the scaled quantity (round to 2 decimal places if needed)
        let formattedQuantity;
        if (scaledQuantity % 1 === 0) {
            formattedQuantity = scaledQuantity.toString();
        } else {
            formattedQuantity = scaledQuantity.toFixed(1).replace(/\.0$/, '');
        }
        
        // Replace the quantity in the original string
        return ingredient.replace(match[0], `${formattedQuantity} ${unit}`);
    }
    
    return ingredient; // Return unchanged if no quantity is found
}

// Toggle between metric and imperial measurements
function toggleMeasurementSystem(system) {
    const metricToggle = document.getElementById('metric-toggle');
    const imperialToggle = document.getElementById('imperial-toggle');
    const ingredientsContainer = document.getElementById('view-recipe-ingredients');
    
    if (!metricToggle || !imperialToggle || !ingredientsContainer) return;
    
    // Update toggle button styles
    if (system === 'metric') {
        metricToggle.className = 'text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full';
        imperialToggle.className = 'text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full';
    } else {
        metricToggle.className = 'text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full';
        imperialToggle.className = 'text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full';
    }
    
    // Convert measurements in ingredients
    const ingredientItems = ingredientsContainer.querySelectorAll('.flex.items-start span');
    
    ingredientItems.forEach(item => {
        const text = item.textContent;
        
        if (system === 'metric') {
            item.textContent = convertToMetric(text);
        } else {
            item.textContent = convertToImperial(text);
        }
    });
}

// Convert ingredient text to metric units
function convertToMetric(text) {
    // In a real application, this would contain conversion logic
    // For now, we'll just simulate it
    if (text.includes('cup') || text.includes('cups')) {
        return text.replace(/(\d+(\.\d+)?)\s*(cup|cups)/i, (match, quantity) => {
            const ml = parseFloat(quantity) * 237;
            return `${ml.toFixed(0)} ml`;
        });
    }
    
    if (text.includes('oz') || text.includes('ounce') || text.includes('ounces')) {
        return text.replace(/(\d+(\.\d+)?)\s*(oz|ounce|ounces)/i, (match, quantity) => {
            const grams = parseFloat(quantity) * 28.35;
            return `${grams.toFixed(0)} g`;
        });
    }
    
    if (text.includes('lb') || text.includes('pound') || text.includes('pounds')) {
        return text.replace(/(\d+(\.\d+)?)\s*(lb|pound|pounds)/i, (match, quantity) => {
            const kg = parseFloat(quantity) * 0.454;
            return `${kg.toFixed(2)} kg`;
        });
    }
    
    return text;
}

// Convert ingredient text to imperial units
function convertToImperial(text) {
    // In a real application, this would contain conversion logic
    // For now, we'll just simulate it
    if (text.includes('ml')) {
        return text.replace(/(\d+(\.\d+)?)\s*ml/i, (match, quantity) => {
            const cups = parseFloat(quantity) / 237;
            return `${cups.toFixed(2)} cups`;
        });
    }
    
    if (text.includes('g') && !text.includes('kg')) {
        return text.replace(/(\d+(\.\d+)?)\s*g(?!r)/i, (match, quantity) => {
            const oz = parseFloat(quantity) / 28.35;
            return `${oz.toFixed(1)} oz`;
        });
    }
    
    if (text.includes('kg')) {
        return text.replace(/(\d+(\.\d+)?)\s*kg/i, (match, quantity) => {
            const pounds = parseFloat(quantity) * 2.2;
            return `${pounds.toFixed(1)} pounds`;
        });
    }
    
    return text;
}

// Toggle nutritional information visibility
function toggleNutritionalInfo() {
    const contentDiv = document.getElementById('nutritional-info-content');
    const iconDiv = document.getElementById('nutritional-info-icon');
    
    if (contentDiv && iconDiv) {
        contentDiv.classList.toggle('hidden');
        iconDiv.classList.toggle('rotate-180');
    }
}

// Add recipe ingredients to shopping list
function addIngredientsToShoppingList(recipeId) {
    // Get recipes
    const recipes = JSON.parse(localStorage.getItem('hospoHubRecipes') || '[]');
    
    // Find the recipe
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
        alert('No ingredients found.');
        return;
    }
    
    // Get current servings and original servings
    const servingsEl = document.getElementById('view-recipe-servings');
    const currentServings = parseInt(servingsEl.textContent);
    const originalServings = parseInt(servingsEl.dataset.originalServings);
    
    // Calculate scaling factor
    const scalingFactor = currentServings / originalServings;
    
    // Scale ingredients if needed
    const scaledIngredients = recipe.ingredients.map(ingredient => {
        if (scalingFactor !== 1) {
            return scaleIngredientQuantity(ingredient, scalingFactor);
        }
        return ingredient;
    });
    
    // Get existing shopping list
    let shoppingList = JSON.parse(localStorage.getItem('hospoHubShoppingList') || '[]');
    
    // Add ingredients to shopping list
    scaledIngredients.forEach(ingredient => {
        shoppingList.push({
            item: ingredient,
            recipe: recipe.name,
            checked: false
        });
    });
    
    // Save updated shopping list
    localStorage.setItem('hospoHubShoppingList', JSON.stringify(shoppingList));
    
    // Show confirmation
    alert(`${scaledIngredients.length} ingredients added to shopping list.`);
}

// Add recipe to class
function addRecipeToClass(recipeId) {
    // This would connect to the class management functionality
    // For now, we'll just show a placeholder message
    alert('Recipe added to class planning. This feature would integrate with the Class Management module.');
}

// Print recipe
function printRecipe() {
    window.print();
}

// Toggle favorite status for a recipe
function toggleFavoriteRecipe() {
    const button = document.getElementById('recipe-favorite-button');
    
    if (button) {
        // Toggle filled/unfilled heart
        const currentPath = button.querySelector('svg path');
        
        if (currentPath) {
            if (currentPath.getAttribute('fill') === 'none') {
                // Mark as favorite
                currentPath.setAttribute('fill', 'currentColor');
                currentPath.setAttribute('stroke', 'none');
            } else {
                // Remove from favorites
                currentPath.setAttribute('fill', 'none');
                currentPath.setAttribute('stroke', 'currentColor');
            }
        }
    }
}

// Share recipe
function shareRecipe() {
    const recipeName = document.getElementById('view-recipe-title').textContent;
    
    // In a real app, this would open a share dialog
    // For now, simulate with an alert
    alert(`Share "${recipeName}" via email, social media, or generate a shareable link. This feature would be implemented in the full version.`);
}// recipes.js - Enhanced functionality for the recipes page

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize UI components
    initializeUI();
    
    // Load recipes
    loadRecipes();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize recipe parser
    initializeRecipeParser();
});

// Check if user is authenticated
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('hospoHubUser') || '{}');
    
    if (!user.isAuthenticated) {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI with user info
    updateUserInfo(user);
}

// Update UI with user information
function updateUserInfo(user) {
    // Set user name
    document.querySelectorAll('#user-name, #mobile-user-name').forEach(el => {
        el.textContent = user.name || 'User';
    });
    
    // Set user email for mobile view
    const mobileEmail = document.getElementById('mobile-user-email');
    if (mobileEmail) {
        mobileEmail.textContent = user.email || '';
    }
    
    // Set user initials
    const initials = getUserInitials(user.name || 'User');
    document.querySelectorAll('.user-initials').forEach(el => {
        el.textContent = initials;
    });
}

// Get user initials from name
function getUserInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
}

// Initialize UI components
function initializeUI() {
    // Toggle user menu
    const userMenuButton = document.querySelector('.user-menu-button');
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function() {
            userMenu.classList.toggle('hidden');
        });
    }
    
    // Toggle mobile menu
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Handle sign out
    document.querySelectorAll('#sign-out, #mobile-sign-out').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            signOut();
        });
    });
}

// Sign out user
function signOut() {
    localStorage.removeItem('hospoHubUser');
    window.location.href = 'login.html';
}

// Load recipes from storage or API
function loadRecipes() {
    // For demonstration, we'll use some sample data or load from localStorage
    let recipes = JSON.parse(localStorage.getItem('hospoHubRecipes') || '[]');
    
    // If no recipes in localStorage, use sample data
    if (recipes.length === 0) {
        recipes = getSampleRecipes();
        localStorage.setItem('hospoHubRecipes', JSON.stringify(recipes));
    }
    
    // Display recipes
    displayRecipes(recipes);
}

// Get sample recipe data
function getSampleRecipes() {
    // This would be replaced with an API call in production
    return [
        {
            id: 1,
            name: "Chocolate Soufflé",
            category: "desserts",
            difficulty: "intermediate",
            prepTime: 30,
            cookTime: 15,
            servings: 4,
            yield: "4 individual soufflés",
            description: "A light and airy chocolate dessert that rises to perfection.",
            ingredients: [
                "6 large eggs, separated",
                "200g dark chocolate, chopped",
                "50g butter",
                "100g granulated sugar",
                "1 tsp vanilla extract",
                "Pinch of salt",
                "Powdered sugar for dusting"
            ],
            instructions: [
                "Preheat oven to 190°C (375°F).",
                "Butter and sugar six 6-ounce ramekins.",
                "Melt chocolate and butter together in a double boiler.",
                "Beat egg yolks with half the sugar until pale and thick.",
                "Fold chocolate mixture into egg yolks with vanilla.",
                "Beat egg whites with salt until foamy, then gradually add remaining sugar until stiff peaks form.",
                "Gently fold egg whites into chocolate mixture in three additions.",
                "Fill ramekins and bake for 12-14 minutes until risen but centers are still slightly soft.",
                "Dust with powdered sugar and serve immediately."
            ],
            notes: "For best results, make sure your egg whites are at room temperature before beating. The soufflés must be served immediately after baking.",
            tags: ["chocolate", "french", "dessert", "impressive"],
            nutritionalInfo: {
                calories: 320,
                protein: 7,
                carbs: 28,
                fat: 22
            },
            dietaryInfo: {
                vegetarian: true,
                glutenFree: true
            },
            image: "https://via.placeholder.com/800x600?text=Chocolate+Souffle",
            dateAdded: "2023-06-10",
            author: "Chef Julia"
        },
        {
            id: 2,
            name: "Beef Wellington",
            category: "main-courses",
            difficulty: "advanced",
            prepTime: 60,
            cookTime: 90,
            servings: 6,
            yield: "1 large beef wellington",
            description: "A classic dish of fillet steak coated with pâté and mushrooms, wrapped in puff pastry.",
            ingredients: [
                "700g beef fillet",
                "300g mushrooms, finely chopped",
                "4 slices of prosciutto",
                "2 tbsp Dijon mustard",
                "200g pâté (optional)",
                "500g puff pastry",
                "1 egg, beaten",
                "2 tbsp olive oil",
                "Salt and pepper to taste"
            ],
            instructions: [
                "Season the beef fillet and sear in a hot pan until browned all over. Cool completely.",
                "Cook mushrooms until moisture evaporates. Add herbs and cool.",
                "Brush beef with mustard.",
                "Lay out plastic wrap and arrange prosciutto. Spread mushroom mixture over prosciutto.",
                "Place beef on top and wrap tightly. Refrigerate for 30 minutes.",
                "Roll out pastry and unwrap beef from plastic onto pastry.",
                "Wrap beef in pastry, seal edges, and brush with beaten egg.",
                "Score the pastry and refrigerate for 30 minutes.",
                "Bake at 200°C (400°F) for 25-30 minutes for medium-rare.",
                "Rest for 10 minutes before slicing."
            ],
            notes: "Ensure the mushroom mixture and beef are completely cool before wrapping to prevent the pastry from becoming soggy.",
            tags: ["beef", "english", "special occasion", "dinner party"],
            nutritionalInfo: {
                calories: 580,
                protein: 42,
                carbs: 26,
                fat: 35
            },
            dietaryInfo: {
                vegetarian: false,
                glutenFree: false
            },
            image: "https://via.placeholder.com/800x600?text=Beef+Wellington",
            dateAdded: "2023-05-25",
            author: "Chef Gordon"
        },
        {
            id: 3,
            name: "French Baguette",
            category: "breads",
            difficulty: "beginner",
            prepTime: 30,
            cookTime: 150,
            servings: 4,
            yield: "2 baguettes",
            description: "Classic French bread with a crisp crust and chewy interior.",
            ingredients: [
                "500g bread flour",
                "10g salt",
                "7g active dry yeast",
                "350ml cool water",
                "Flour for dusting"
            ],
            instructions: [
                "Mix flour, salt, and yeast in a large bowl.",
                "Add water and mix until a shaggy dough forms.",
                "Knead for 10 minutes until smooth and elastic.",
                "Let rise in a covered bowl for 1-2 hours until doubled.",
                "Divide into 2-3 pieces and pre-shape into rectangles.",
                "Rest for 20 minutes, then shape into baguettes.",
                "Let rise for 30-45 minutes on a floured surface.",
                "Preheat oven to 240°C (465°F) with a baking stone if available.",
                "Score the tops with a sharp knife and spray with water.",
                "Bake for 20-25 minutes until golden brown and hollow-sounding when tapped.",
                "Cool on a wire rack before slicing."
            ],
            notes: "For a crispier crust, place a pan of water in the bottom of the oven during baking to create steam.",
            tags: ["bread", "french", "baking", "staple"],
            nutritionalInfo: {
                calories: 230,
                protein: 8,
                carbs: 45,
                fat: 1
            },
            dietaryInfo: {
                vegetarian: true,
                vegan: true
            },
            image: "https://via.placeholder.com/800x600?text=French+Baguette",
            dateAdded: "2023-05-15",
            author: "Chef Pierre"
        }
    ];
}

// Display recipes in the UI
function displayRecipes(recipes) {
    const container = document.querySelector('.recipes-container');
    if (!container) return;
    
    // Clear existing recipe cards
    container.innerHTML = '';
    
    // Add recipe cards
    recipes.forEach(recipe => {
        container.appendChild(createRecipeCard(recipe));
    });
}

// Create a recipe card element
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'bg-white overflow-hidden shadow rounded-lg recipe-card';
    card.dataset.id = recipe.id;
    
    // Format difficulty and category for display
    const difficultyClasses = {
        'beginner': 'bg-green-100 text-green-800',
        'intermediate': 'bg-yellow-100 text-yellow-800',
        'advanced': 'bg-red-100 text-red-800'
    };
    
    const difficultyClass = difficultyClasses[recipe.difficulty] || 'bg-gray-100 text-gray-800';
    const formattedCategory = recipe.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const formattedDifficulty = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    
    // Format time for display
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    let timeDisplay = '';
    if (totalTime >= 60) {
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        timeDisplay = `${hours} hr${hours > 1 ? 's' : ''}${minutes > 0 ? ' ' + minutes + ' min' : ''}`;
    } else {
        timeDisplay = `${totalTime} min`;
    }
    
    // Create dietary tags HTML
    let dietaryTagsHTML = '';
    if (recipe.dietaryInfo) {
        if (recipe.dietaryInfo.vegetarian) {
            dietaryTagsHTML += `<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 ml-2">Vegetarian</span>`;
        }
        if (recipe.dietaryInfo.vegan) {
            dietaryTagsHTML += `<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 ml-2">Vegan</span>`;
        }
        if (recipe.dietaryInfo.glutenFree) {
            dietaryTagsHTML += `<span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 ml-2">Gluten-Free</span>`;
        }
    }
    
    card.innerHTML = `
        <div class="relative pb-2/3">
            <img class="absolute h-full w-full object-cover" src="${recipe.image}" alt="${recipe.name}">
        </div>
        <div class="px-4 py-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">${recipe.name}</h3>
            <div class="mt-2 flex items-center text-sm text-gray-500 flex-wrap">
                <span class="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">${formattedCategory}</span>
                <span class="ml-2 px-2 py-1 text-xs rounded-full ${difficultyClass}">${formattedDifficulty}</span>
                ${dietaryTagsHTML}
            </div>
            <p class="mt-2 text-sm text-gray-500">${recipe.description}</p>
            <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    <span class="ml-1 text-gray-500 text-sm">${timeDisplay}</span>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-recipe-btn text-indigo-600 hover:text-indigo-900 focus:outline-none" aria-label="Edit Recipe">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="delete-recipe-btn text-red-600 hover:text-red-900 focus:outline-none" aria-label="Delete Recipe">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6">
            <a href="#" class="view-recipe-link text-sm font-medium text-indigo-600 hover:text-indigo-500">View Recipe</a>
        </div>
    `;
    
    return card;
}
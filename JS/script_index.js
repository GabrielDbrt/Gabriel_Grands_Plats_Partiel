document.addEventListener('DOMContentLoaded', async () => {
    const recipesContainer = document.getElementById('recipes-list');
    const searchInput = document.getElementById('search');
    const tagsContainer = document.getElementById('tags-container');
    const ingredientsList = document.getElementById('ingredients-list');
    const appliancesList = document.getElementById('appliances-list');
    const ustensilsList = document.getElementById('ustensils-list');

    const response = await fetch('assets/json/recipes.json');
    const recipes = await response.json();

    function displayRecipes(recipes) {
        recipesContainer.innerHTML = '';

        if (recipes.length === 0) {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = "Aucune recette ne correspond à votre recherche..." +
                "Vous pouvez chercher « tarte aux pommes », « poisson », etc.";
            errorMessage.classList.add('text-center', 'fs-5');
            recipesContainer.appendChild(errorMessage);
        } else {
            recipes.forEach((recipe, index) => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('col');
                recipeCard.id = index + 1;
                recipeCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-img-top"></div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <h2 class="card-title col-8 card-name">${recipe.name}</h2>
                                <div class="card-title col-4 text-end card-time-container">
                                    <img class="me-1 card-time-watch" alt="" src="./assets/img/watch-time.svg" /><span class="card-time">${recipe.time} min</span>
                                </div>
                            </div>
                            <div class="row">
                                <ul class="card-text col-6 list-unstyled card-ingredients-list">
                                    ${recipe.ingredients.map(ingredient => `
                                        <li class="card-ingredients-list-item">
                                            <span class="card-ingredients-list-item-ingredient">${ingredient.ingredient}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                                <p class="card-text col-6 card-description">${recipe.description}</p>
                            </div>
                        </div>
                    </div>
                `;
                recipesContainer.appendChild(recipeCard);
            });
        }
    }

    const searchRecipes = (searchTerm) => {
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filteredRecipes.length > 0) {
            const firstRecipeId = filteredRecipes[0].id;
            document.getElementById(firstRecipeId).scrollIntoView({behavior: 'smooth'});
        }

        displayRecipes(filteredRecipes);
    }

    document.getElementById('recipes-list').addEventListener('click', (event) => {
        if (event.target.tagName === 'SPAN') {
            searchRecipes(event.target.textContent);
        }
    });

    function filterRecipesByTags(tags) {
        const filteredRecipes = recipes.filter(recipe =>
            tags.every(tag =>
                recipe.ingredients.some(ingredient => ingredient.ingredient === tag) ||
                recipe.appliances.includes(tag) ||
                recipe.ustensils.includes(tag)
            )
        );
        displayRecipes(filteredRecipes);
    }

    function addTag(tag) {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tags', 'badge', 'bg-primary', 'ps-3', 'pe-2', 'py-2', 'me-3', 'mb-2', 'rounded');
        tagElement.innerHTML = `
            <span>${tag}</span>
            <button type="button" class="tag-close-btn align-middle ms-1" aria-label="Close">
                <img src="./assets/img/tag-close.svg" alt="" aria-hidden="true" />
            </button>
        `;
        tagsContainer.appendChild(tagElement);
        tagElement.querySelector('.tag-close-btn').addEventListener('click', () => {
            tagElement.remove();
            updateFilters();
        });
    }

    function updateFilters() {
        const tags = Array.from(tagsContainer.children).map(tag => tag.textContent.trim());
        filterRecipesByTags(tags);
    }

    searchInput.addEventListener('input', (event) => {
        searchRecipes(event.target.value);
    });

    ingredientsList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            addTag(event.target.textContent.trim());
            updateFilters();
        }
    });

    appliancesList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            addTag(event.target.textContent.trim());
            updateFilters();
        }
    });

    ustensilsList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            addTag(event.target.textContent.trim());
            updateFilters();
        }
    });

    displayRecipes(recipes);
});

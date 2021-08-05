'use strict';

const search = document.getElementById('search');
const form = document.getElementById('submit-form');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const reseultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

// Functions

// search meal and fetch from API
const searchMeal = (e) => {
  e.preventDefault();

  // clear single meal
  single_mealEl.innerHTML = '';
  // get search term
  const term = search.value;
  //console.log(term);

  //check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data.meals);
        reseultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          reseultHeading.innerHTML = ` <h2>No results`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `
            )
            .join('');
        }
      });
    search.value = '';
  } else {
    alert('Please enter a serach value');
  }
};

// fetch meal by ID
const getMealById = (mealID) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      //console.log(meal);
      addMealToDom(meal);
    });
};

// add meal to DOM
const addMealToDom = (meal) => {
  // vyrobime pole ingediencii, ktore vytiahme z API
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break; // vpripade ze nebude ziadna ingrediencia v preiehajucej iteracii zastavime cyklus
    }
    console.log(ingredients);
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>

      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />

      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''} 
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''} 
      </div>

      <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join('')}        
          </ul>
      </div>
    </div>
  `;
};

// fetch random meal from API
const getRandomMeal = () => {
  // clear single meal
  single_mealEl.innerHTML = '';
  reseultHeading.innerHTML = '';
  mealsEl.innerHTML = '';

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
};

// Event listeners
form.addEventListener('submit', searchMeal);

random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', (e) => {
  // path is supported in chrome but not in firefox
  const path = e.path || (e.composedPath && e.composedPath());

  // path.find - zistime na aky element sme klikli a nasledne prejde kontrola ci sa tam nachadza class meal-info
  const mealInfo = path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  // zistime id receptu na ktory sme klikli
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    //console.log(mealID);
    // vytiahneme detailne info o danom recepte
    getMealById(mealID);
  }
});

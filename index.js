const submitButton= document.querySelector(".btn-submit")
const search=document.querySelector(".search")
const select=document.querySelector("select")
const recipeWrapper=document.querySelector(".all-recipe")
const details=document.querySelector(".details")
const exit1= document.querySelector(".exit1")
const subtitle=document.querySelector(".subtitle")
const container=document.querySelector(".container")

function fetchAPI(url1){
        fetch(url1)
        .then(res=>res.json())
        .then(data=> {
            let html="";
            if(data.meals){
                data.meals.forEach(e =>{
                    html+=`
                    <div class="recipe" data-id="${e.idMeal}">
                    <h1>${e.strMeal}</h1>
                    <p class="cuisine">${e.strArea}</p>
                    <div class="recipe-image">
                    <img src="${e.strMealThumb}" alt="meal">
                    </div>
                    <div class="recipe-name">
                        <a href="#" class="get-recipe">Show instructions</a> 
                    </div>
                    </div>
                    `
                })
                recipeWrapper.innerHTML=html;
            }else{
                html="<p style='font-size:2em;margin:0 auto'>No recipes</p>"
                recipeWrapper.innerHTML=html;
            }
    })
        
    }

function searching(){
    
        let input=search.value.trim();
        let url1=""
        if(select.value=="name"){
        url1=`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
        fetchAPI(url1) 
        }else if(select.value=="ingredients"){
            url1=`https://www.themealdb.com/api/json/v1/1/filter.php?i=${input}`
            fetchAPI(url1)
        }
        else{
            url1="https://www.themealdb.com/api/json/v1/1/random.php"
            fetchAPI(url1) 
        }
    
    search.value="";
    
}

select.addEventListener("change",function(){
    if(this.value=="name"){
        search.placeholder= "Steak, Tacos etc."
        subtitle.innerHTML= "Search for recipes based on the name"

    }else if(this.value=="ingredients"){
        search.placeholder= "Chicken, Beef etc."
        subtitle.innerHTML="Search for recipes based on your main ingredient"
    }else{
        search.placeholder="Click Enter or on the Button"
        subtitle.innerHTML="Get a random meal"
    }
})

submitButton.addEventListener("click",function(){
    searching()
})


search.addEventListener("keyup", function(e){
        if(e.key==="Enter" ||e.keyCode===13){
            searching()
        }       
})

recipeWrapper.addEventListener("click", function(e){
    getRecipe(e)
})

function removeDetails(){
    details.innerHTML="";
    details.style.display="none";
    container.style.filter="none";
}


function getRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains("get-recipe")){
        let targetRecipe=e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${targetRecipe.dataset.id}`)
        .then(response=>response.json())
        .then(data=>{
            const regex =new RegExp("strIngredient+(?:[1-9]|0[1-9]|1[0-9]|20)$")
            let html=`
            <button type="button" class="exit1" onclick="removeDetails()"><i class="fas fa-times-circle"></i></button>
            <h1>${data.meals[0].strMeal}</h1>
            <p class="cuisine">${data.meals[0].strArea}</p>
            <img src="${data.meals[0].strMealThumb}" alt="meal">
            <a href="${data.meals[0].strYoutube}" target="_blank">Watch video</a>
            <h2>Ingredients:</h2>
            <div class="ulList">

            </div>
            <h2>Instructions:</h2>
            <p class="instructions">${data.meals[0].strInstructions}
            </p>
            `;
            details.innerHTML+=html
            details.style.display="block";
            const ulList=document.querySelector(".ulList")
            for(let i=1;i<21;i++){
                if(data.meals[0]["strMeasure"+i]!= (null ||""))
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(`${data.meals[0]["strMeasure"+i]} ${data.meals[0]["strIngredient"+i]}`));
                ulList.appendChild(li)
                container.style.filter="blur(8px)";
            }
        })
    }
    
}




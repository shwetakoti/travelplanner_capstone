let userType ;
let userSubmit;
let city;
let entity;
let firstName;
let lastName;
let userName;
let email;
let password;
let cityId;
let className
let restaurantInfo = [];
let favorites = []
let resId,resName,resUrl,resCuisines,resRating,resRatingText,resThumb;
let userId ;
let restaurant
let i;

let counter = 6;
let startIndex = 0;

let authToken;

function hotelSubmit()
{
  $('button').click(function(event)
  {
    event.preventDefault();

    userType = $(event.currentTarget).attr('id');
    console.log(`${userType}`);

    /*redirectUser function checks if user is new or existing user and based on that makes request to endpoints*/
    redirectUser(userType);
   })
 }//hotelSubmit

 function redirectUser(userType)
 {
   /*If user is new,then redirect them to signup form page, otherwise redirect them to login form page*/
   if(userType == 'new')
   {
     //$('.js-header').html('');
     $('.js-homepage').html('');
     $('.js-header').html(`<header>
                             <div class="logo-container">
                               <img src="https://thumbs.dreamstime.com/z/restaurant-logo-12230326.jpg" </img>
                               </div>
                           </header>`);
     $('.js-form').html(`
       <div class="row">
        <form class="col-12">
         <p><h2>Please fill this form to create an account</h2></p>
         <div class="signup">
             <label for="fname"><b>First Name<b></label>
             <input type="text"  placeholder="Enter Firstname" name="fname" class="js-fname" required/>
            <br>
            <label for="lname"><b>Last Name<b></label>
            <input type="text" placeholder="Enter Lastname" name="lname" class="js-lname" required/>
            <br>
            <label for="username"><b>Username<b></label>
            <input type="text" placeholder="Enter Username" name="username" class="js-username" required/>
            <br>
             <label for="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" class="js-email" required/>
           <br>
            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" class="js-password" value required/>
            <br>
             <button type="button" id="cancel" class="js-signup">Cancel</button>
            <button type="button" id="signup" class="js-signup">Sign Up</button>
         </div>
        </form>
      </div>`)


      $('button').click(function(event)
       {
          event.preventDefault();
          userSubmit = $(event.currentTarget).attr('id');

          if(userSubmit=='signup')
          {

            firstName = $('.js-fname').val();
            lastName = $('.js-lname').val();
            userName = $('.js-username').val();
            email    = $('.js-email').val();
            password = $('.js-password').val();

            if(firstName == ''|| lastName == '' || userName == '' || email == ''||password == '')
            {
             alert('Please fill all the fields');
            }
            else
            {
              console.log('in js-signup');
              xhr = new XMLHttpRequest();
              var url = '/restaurants';
              xhr.open("POST", url, true);
              xhr.setRequestHeader("Content-type", "application/json");

              xhr.onreadystatechange = function()
              {
                if (xhr.readyState == 4)
                {
                  authToken = JSON.parse(xhr.responseText);
             // console.log(authToken);
                }
              }
            var data = JSON.stringify
            ({

              'firstName': `${firstName}`,
              'lastName': `${lastName}`,
              'userName': `${userName}`,
              'email':     `${email}`,
              'password':`${password}`
            })

            xhr.send(data);

            $('.js-form').html('');
            navigationBar();
          }
       }//signup
       if(userSubmit=='cancel')
       {
         console.log('In cancel')
         $('.js-form').html('');
         $('.js-form').html(`<p> <h2>No problem! You can sign up later <h2></p>`)
       }
    }) //button event
  }//if new user
  else
  { /*login form*/
    $('.js-header').html('');
    $('.js-homepage').html('');
    $('.js-header').html(`<div class="logo-container">
                                <img src="https://thumbs.dreamstime.com/z/restaurant-logo-12230326.jpg" </img>
                              </div>
                        `);
    $('.js-form').html(`
      <div class="row">
        <h2>Enter your username and password</h2>
            <br>
           <form class="col-12">
            <label for="username"><b>Username<b></label>
            <input type="text" placeholder="Enter Username" name="username" class="js-username" required>
             <br>

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" class="js-password" required>
             <br>

            <button type="button" id="login" class="js-login">Login</button>
           </form>

           <div class="demo-login">
             <p class="demo-login_title"> Try it out:</p>
             <p> <span> username:demoUser</span></p>
             <p> <span> password:demoPassword</span></p>
           </div>
    </div>
    `)

   $('button').click(function(event)
    {
      event.preventDefault();
      userSubmit = $(event.currentTarget).attr('id');
      console.log('in js-login');

      userName = $('.js-username').val();
      password = $('.js-password').val();

      if(userName == ''||password == '')
      {
       alert('Please fill all the fields');
      }

     else
     {
       /*Make a post request to post username and password*/
       xhr = new XMLHttpRequest();
       var url = '/api/auth/login';
       xhr.open("POST", url, true);
       xhr.setRequestHeader("Content-type", "application/json");
       xhr.onreadystatechange = function()
      {
        if (xhr.readyState == 4)
        {
          authToken = JSON.parse(xhr.responseText);
          console.log(authToken);
         }
       }
       var data = JSON.stringify(
         {
           'userName':`${userName}`,
           'password':`${password}`
         })

       xhr.send(data);
       navigationBar();
     }
      //cityIdSearch();
    })//buttonclick
  }//else
}//redirectUse

function navigationBar()
{
/*New or existing users can navigate between logout, restaurant search and view favorites page*/
  $('.js-form').html('');
  $('.js-nav').html(`
  <div class="row">
   <div class="tab">
     <div class="col-4">
       <button id = "home">Logout</button>
     </div>
     <div class="col-4">
       <button id = "search">Restaurant Search</button>
     </div>
     <div class="col-4">
       <button id = "favorites">View Favorites</button>
     </div>
  </div>
 `);

 cityIdSearch() ;

 $('#home').click(function(event)
 {
   //event.preventDefault();

   $('.js-search-results-0').html('');
   $('.js-search-results-1').html('');
   $('.js-search-results-2').html('');
   $('.js-next').html('');
   $('.js-prev').html('');
   $('.js-fav').html('');
   $('.js-nav').html('');
   $('.js-form').html('');
   $('.js-header').html(`
     <header>
          <div class="logo-container">
            <img src="https://thumbs.dreamstime.com/z/restaurant-logo-12230326.jpg" </img>
          </div>
         <section class="js-container app-container">
            <div class="app-callout">
                <h1>Find your favorites</h1>
            </div>
         </section>

    </header>


   <div class="row">
     <section class="js-homepage">
       <div class="col-12">
           <h3>Are you hungry?<br>
               Search your favorite restaurants by signing in or signing up
           </h3>
           <br>
           <br>
          <button id="new" role="button" type="submit">Sign Up</button>
          <button id="existing" role="button" type="submit">Sign In</button>

       </div>
     </section>
  </div>
`)

  $('button').click(function(event)
   {
      event.preventDefault();

      userType = $(event.currentTarget).attr('id');
      console.log(`${userType}`);

  /*redirectUser function checks if user is new or existing user and based on that makes request to endpoints*/
     redirectUser(userType);
   })

})

$('#search').click(function(event)
 {
   event.preventDefault();

   $('.js-search-results-0').html('');
   $('.js-search-results-1').html('');
   $('.js-search-results-2').html('');
   $('.js-next').html('');
   $(className).html('');
   $('.js-fav').html('');
   $('.js-prev').html('');
   cityIdSearch();
 })

 $('#favorites').click(function(event)
 {
   event.preventDefault();

   $('.js-search-results-0').html('');
   $('.js-search-results-1').html('');
   $('.js-search-results-2').html('');

   $(className).html('');

   xhr = new XMLHttpRequest();
   var url = '/restaurants/viewfavorites/'+`${userName}`
   console.log(authToken);

   xhr.open("GET", url, true);
   xhr.setRequestHeader("Content-type", "application/json");
   xhr.setRequestHeader("Authorization", 'Bearer '+ `${authToken}`)
   xhr.onreadystatechange = function()
   {
     if (xhr.readyState == 4)
     {
      restaurant = JSON.parse(xhr.responseText);
      console.log(restaurant.restaurantInfo);

      restaurant.restaurantInfo.forEach((fav,i) =>
      {
         var column = Math.floor(i/2);
         className = '.js-search-results-'+column;

         $('.js-form').html('');
         $('.js-next').html('');
         $('.js-prev').html('');
         $('.js-fav').append(
           `<div class="row">
             <div class="col-12">
              <br>
               <ul>
                <h2>${fav.resName}</h2>
                <a href="${fav.resUrl}" target="_blank"><img src="${fav.resThumb}" target="_blank"</img></a>
                <h5>${fav.resCuisines}</h5>
                <h5>${fav.resRating}</h5>
                <h5>${fav.resRatingText}</h5>
              </ul>
           </div>
          </div> `
          )
      }) //.each
     }
   }
   xhr.send();
 })

} //navigationbar

function cityIdSearch()
 {
    console.log('in restaurant search');

    $('.js-form').html(`
      <div class="row">
       <form class="col-12 js-locationForm form-tab">
          <br>
           <label for="city"><b>Enter City<b></label>
           <input type="text" name="city" class="js-city" required/>
           <br>
           <label><b>Entity Type<b></label>
           <input type="text" name="city" value="city"  class="location" required/>
           <br>
           <br>

           <button id="submit" class="js-submit" role="button" type="submit">Submit</button>
           <br>
           <br>
       </form>

       <div class="demo-login">
         <p> <span> Demo City:seattle</span></p>
       </div>
    </div>
      `)

      $('.js-locationForm').submit(event =>
      {
        event.preventDefault();
        console.log('I am inside restaurantsearch/location')
        const queryTarget = $(event.currentTarget).find('.js-city');
        city = queryTarget.val();
        //entity = $('.location').val();
        entity = 'city';
        // clear out the input
        console.log(`${entity}`);
        queryTarget.val("");
        const settings =
         {
        	 url: 'https://developers.zomato.com/api/v2.1/cities',

           headers:
           {
             "user-key":'cba9c1eb99c74720b299dc97c499bacd'
           },
           data:
           {
                  q: `${city}`,
                  count: 6,

           },
           dataType: 'json',
           type: 'GET',
          success: function(data)
           {
              let i ;
              console.log(data.location_suggestions);
              $.each(data.location_suggestions,function(i,location)
              {
               console.log(`${location.id}`);
               cityId = `${location.id}`;
               })

               restaurantSearch(cityId);
           }
         }
         $.ajax(settings);

      })

}

function restaurantSearch(cityId)
{
  const settings =
   {
     url: 'https://developers.zomato.com/api/v2.1/search',

     headers:
     {
       "user-key":'cba9c1eb99c74720b299dc97c499bacd'
     },
     data:
     {
            entity_id: `${cityId}`,
            entity_type: `${entity}`,
            count: 6,
            start:0

     },
     dataType: 'json',
     type: 'GET',
    success: displayData

   }
   $.ajax(settings);
}

function displayData(data)
{
  $('.js-form').html('');
  $('.js-view').html('');
  $('.js-next').html('');
  $('.js-search-results-0').html('');
  $('.js-search-results-1').html('');
  $('.js-search-results-2').html('');

  //console.log(data);
  console.log(data.restaurants.length);
  data.restaurants.forEach(restaurant =>
  {
    resName = `${restaurant.restaurant.name}`;
    resUrl = `${restaurant.restaurant.url}`;
    resId = `${restaurant.restaurant.R.res_id}`;
    resThumb = `${restaurant.restaurant.thumb}`;
    resCuisines = `${restaurant.restaurant.cuisines}`;
    resRating = `${restaurant.restaurant.user_rating.aggregate_rating}`;
    resRatingText = `${restaurant.restaurant.user_rating.rating_text}` ;

    console.log('Inside displaydata');
    console.log(resThumb);
    console.log(restaurant.restaurant.cuisines);

    restaurantInfo.push({
       resId : `${resId}`,
       resName : `${resName}`,
       resUrl : `${resUrl}`,
       resThumb : `${resThumb}` ,
       resCuisines : `${resCuisines}`,
       resRating : `${resRating}`,
       resRatingText : `${resRatingText}` ,
    })
  })



  $.each(data.restaurants,function(i,restaurant)
  {
     var column = Math.floor(i/2);
     console.log('this is column'+column);
     var className = '.js-search-results-'+column;
     console.log(restaurant.restaurant.thumb);
     console.log(restaurant.restaurant.cuisines);
     console.log(restaurant.restaurant.user_rating.aggregate_rating);
     console.log(restaurant.restaurant.user_rating.rating_text);


     $(className).append(
      ` <div>
          <br>
          <ul>
            <h3>${restaurant.restaurant.name}</h3>
            <a href="${restaurant.restaurant.url} " target="_blank"><img src="${restaurant.restaurant.thumb}" target="_blank"></a>
            <h4>${restaurant.restaurant.cuisines}</h4>
            <h4>${restaurant.restaurant.user_rating.aggregate_rating}</h4>
            <button id="${restaurant.restaurant.R.res_id}" class="js-favorite fav">Fav</button>
          </ul>
        </div>
      `);
  }) //.each


    $('.js-favorite').on('click',function(event)
    {
        var favorite = $(event.currentTarget).attr('id');
        console.log(favorite);
        var targetFav = $(event.currentTarget);
        var otherFavs = $('.js-favorite').not(targetFav);

        otherFavs.removeClass('fav-on');
        targetFav.toggleClass('fav-on');

        if(favorites.length==0)
        {
          console.log('first favorite restaurant');

           restaurantInfo.forEach(restaurant =>
           {
             if(favorite == restaurant.resId)
             {
                favorites.push(
                 {
                   resId : restaurant.resId,
                   resName : restaurant.resName,
                   resThumb : restaurant.resThumb,
                   resCuisines : restaurant.resCuisines,
                   resRating : restaurant.resRating,
                   resRatingText : restaurant.resRatingText ,
                   resUrl : restaurant.resUrl
                 })
              }
           })
            xhr = new XMLHttpRequest();
            var url = '/restaurants/favorites';
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function()
            {
              if (xhr.readyState == 4)
              {
                var json = JSON.parse(xhr.responseText);
              }
            }
           var data = JSON.stringify(
           {
             'userName':`${userName}`,
             'city':`${city}`,
             'locationType':`${entity}`,
             'restaurantInfo': favorites
            })
          console.log(data);
          xhr.send(data);
       }//if
       else
       {
          console.log('Not first favorite restaurant');

          restaurantInfo.forEach(restaurant =>
          {
            if(favorite == restaurant.resId)
            {
              favorites.push(
                {
                  resId : restaurant.resId,
                  resName : restaurant.resName,
                  resThumb : restaurant.resThumb,
                  resCuisines : restaurant.resCuisines,
                  resRating : restaurant.resRating,
                  resRatingText : restaurant.resRatingText ,
                  resUrl : restaurant.resUrl
                })
             }
          })


         /*make a PUT request*/
          xhr = new XMLHttpRequest();
          var url = '/restaurants/favorites/'+`${userId}`;
          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Content-type", "application/json");
          xhr.onreadystatechange = function()
          {
            if (xhr.readyState == 4)
            {
              var json = xhr.responseText;

            }
          }
         var data = JSON.stringify(
         {
           'userName' : `${userName}`,
           'city':`${city}`,
           'locationType':`${entity}`,
           'restaurantInfo': favorites
         })
         console.log(data);
        xhr.send(data);
       }
    })//button click


   //Except first page, all other pages will have have a 'previous' button along with 'next' button
    if(startIndex > 0)
     {
       $('.js-prev').html(`<br><br><button id="prev" role="button" type="submit">Previous</button>`)
      /// $('.js-view').html(`<br><br><button id="view" role="button" type="submit">View Favorites</button>`) ;
     }

   //Each page will have a 'Next' button
   if(data.restaurants.length >=6)
   {
    $('.js-next').html(`<br><br><button id="next" role="button" type="submit">Next</button>`)
   }

   if(startIndex == 0)
    {
     $('.js-prev').html('');
    }
}//displayData

//Attaching an event to 'Next' and 'Previous' buttons
$('.js-next').on('click','#next',function(event)
{
  event.preventDefault();
  startIndex = startIndex+counter;
  nextResultSet();
})

$('.js-prev').on('click','#prev',function(event)
{
  event.preventDefault();
  startIndex = startIndex-counter;
  prevResultSet();
})

//Event handler when user clicks 'Next' button
function nextResultSet()
{
  console.log('I am in nextResultSet'+startIndex) ;
  const settings =
   {
     url: 'https://developers.zomato.com/api/v2.1/search',
     /*url: 'https://developers.zomato.com/api/v2.1/collections',*/
     headers:
     {
       "user-key":'cba9c1eb99c74720b299dc97c499bacd'
     },
     data:
     {
            entity_id: `${cityId}`,
            entity_type:`${entity}`,
            count: 6,
            start:startIndex
     },
     dataType: 'json',
     type: 'GET',
    success: displayData

   }
   $.ajax(settings);
 }

//Event handler when user clicks 'Previous' button
function prevResultSet()
{
  const settings = {
    url: 'https://developers.zomato.com/api/v2.1/search',
    headers:
    {
      "user-key":'cba9c1eb99c74720b299dc97c499bacd'
    },
    data:
    {
           entity_id: `${cityId}`,
           entity_type: `${entity}`,
           count: 6,
           start:startIndex
    },
    dataType: 'json',
    type: 'GET',
    success: displayData
  };
  $.ajax(settings);
  console.log('In prevResultSet');
  console.log(settings);
}
//callback function to start the app
$(hotelSubmit);

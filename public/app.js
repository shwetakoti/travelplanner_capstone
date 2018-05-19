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
//let restaurantIds = [];
let restaurantInfo = [];
let favorites = []
let resId,resName,resUrl;
let userId ;

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

    /*if userType is new, then redirect them to signuppage
    else, redriect them to search page*/
    redirectUser(userType);
   })
 }//hotelSubmit

 function redirectUser(userType)
 {
   console.log('in redirect User function');
   if(userType == 'new')
   {
     $('.js-homepage').html('');
     $('.js-form').html(`
       <form>
         <div>
          <p>Please fill in this form to create an account.</p>
          <label for="fname"><b>First Name<b></label>
          <input type="text" name="fname" class="js-fname" required>
          <br>
          <label for="lname"><b>Last Name<b></label>
          <input type="text" name="lname" class="js-lname" required>
          <br>
          <label for="username"><b>Username<b></label>
          <input type="text" name="username" class="js-username" required>
          <br>
          <label for="email"><b>Email</b></label>
          <input type="text" placeholder="Enter Email" name="email" class="js-email" required>
          <br>
          <label for="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" class="js-password" required>
          <br>
          <label for="psw-repeat"><b>Repeat Password</b></label>
          <input type="password" placeholder="Repeat Password" name="psw-repeat" required>
          <br>

          <button type="button" id="cancel" class="js-cancel">Cancel</button>
          <button type="button" id="signup" class="js-signup">Sign Up</button>
        </div>
    </form>`)

    $('button').click(function(event)
     {
       event.preventDefault();
       userSubmit = $(event.currentTarget).attr('id');
       if(userSubmit=='signup')
       {
         console.log('in js-signup');

         firstName = $('.js-fname').val();
         lastName = $('.js-lname').val();
         userName = $('.js-username').val();
         email = $('.js-email').val();
         password = $('.js-password').val();

         xhr = new XMLHttpRequest();
         var url = '/restaurants';
         xhr.open("POST", url, true);
         xhr.setRequestHeader("Content-type", "application/json");
         xhr.onreadystatechange = function()
        {
          if (xhr.readyState == 4)
          {
           var user = JSON.parse(xhr.responseText);
          // var json = xhr.responseText
           userId = user._id ;
           console.log(user);
           //console.log(user._id);*/
          }
        }
       var data = JSON.stringify(
       {
         'firstName': `${firstName}`,
         'lastName': `${lastName}`,
         'userName': `${userName}`,
         'email':`${email}`,
         'password':`${password}`
       })
       xhr.send(data);

       cityIdSearch();
    }
    else
    {
       $('.js-homepage').html('');
       $('.js-home').html(`<p>You can sign up later </p>`)

    }
   }) //button event

    /*capture user details and store it in database*/
    /*$.post('/restaurants','{firstname:'',lastname:'',city:'',...}')*/
  }//if new user
  else
  {
    //cityIdSearch();
    /*make a GET request to get existing user's userid*/
    $('.js-homepage').html('');
    $('.js-form').html(`
      <form>
        <div>
         <p>Please input your username and password.</p>

          <label for="username"><b>Username<b></label>
          <input type="text" name="username" class="js-username" required>
         <br>

         <label for="psw"><b>Password</b></label>
         <input type="password" placeholder="Enter Password" name="psw" class="js-password" required>
         <br>

         <button type="button" id="login" class="js-login">Login</button>
       </div>
   </form>`)

   $('button').click(function(event)
    {
      event.preventDefault();
      userSubmit = $(event.currentTarget).attr('id');
      console.log('in js-login');

      userName = $('.js-username').val();
      password = $('.js-password').val();

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
      //console.log(data);
      //xhr.send(data);
      xhr.send(data);
      cityIdSearch();
   })//buttonclick
  }//else
}//redirectUse

function cityIdSearch()
 {
    console.log('in restaurant search');
    $('.js-form').html('');
    $('.js-form').html(`
      <form class="js-locationForm">
        <p> Welcome!Please enter your location details:</p>
        <label for="city"><b>City<b></label>
        <input type="text" name="city" class="js-city" required>
        <br>
        <p>Select Entity Type</p>
        <input class="js-radio" type="radio" name="option" id="option1" value="city" role="button" aria-pressed="false"><label for="option1">City</label></div><br>
        <input class="js-radio" type="radio" name="option" id="option2" value="subzone" role="button" aria-pressed="false"><label for="option2">Subzone</label></div><br>
        <input class="js-radio" type="radio" name="option" id="option3" value="zone" role="button" aria-pressed="false"><label for="option3">Zone</label></div><br>
        <input class="js-radio" type="radio" name="option" id="option4" value="landmark" role="button" aria-pressed="false"><label for="option4">Landmark</label></div><br>
        <input class="js-radio" type="radio" name="option" id="option5" value="metro" role="button" aria-pressed="false"><label for="option5">Metro</label></div><br>
        <input class="js-radio" type="radio" name="option" id="option6" value="group" role="button" aria-pressed="false"><label for="option6">Group</label></div><br>
        <br>
        <input type="submit" id="submit" class="js-submit"></input>
        <br>
        <br>
        </form>`)
      $('.js-view').html(`<br><br><button id="view" role="button" type="submit">View Favorites</button>`) ;

      /*make a GET request to fetch all favorite restaurants*/

      $('.js-view').on('click','#view',function(event)
      {
        event.preventDefault();
        //make a get request to restaurants to get a list of all selected restaurants
        console.log('In favorites list');

        xhr = new XMLHttpRequest();
        var url = '/restaurants/viewfavorites/'+`${userName}`
        //var url = '/restaurants/`${userId}`'
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function()
        {
          if (xhr.readyState == 4)
          {
           var restaurant = xhr.responseText;
           console.log(restaurant);
          }
        }
        xhr.send();
      })

      $('.js-locationForm').submit(event =>
      {
        event.preventDefault();
        console.log('I am inside restaurantsearch/location')
        const queryTarget = $(event.currentTarget).find('.js-city');
        city = queryTarget.val();
        entity = $("input[class='js-radio']:checked").val();
        // clear out the input
        console.log(`${entity}`);
        queryTarget.val("");
        const settings =
         {
        	 url: 'https://developers.zomato.com/api/v2.1/cities',
           /*url: 'https://developers.zomato.com/api/v2.1/collections',*/
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

      /*   console.log(`${settings}`);*/
      })

}

function restaurantSearch(cityId)
{
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
  $('.js-search-results-0').html('');
  $('.js-search-results-1').html('');
  $('.js-search-results-2').html('');

  console.log(data);
  data.restaurants.forEach(restaurant =>
  {
    resName= `${restaurant.restaurant.name}`;
    resUrl = `${restaurant.restaurant.url}`;
    resId = `${restaurant.restaurant.R.res_id}`;

    restaurantInfo.push({
       resId : `${resId}`,
       resName : `${resName}`,
       resUrl : `${resUrl}`
    })
  })
   console.log(restaurantInfo);

  $.each(data.restaurants,function(i,restaurant)
  {
     var column = Math.floor(i/2);
     console.log('this is column'+column);
     var className = '.js-search-results-'+column;

     $(className).append(
      ` <div>
          <br>
          <ul>
            <p>${restaurant.restaurant.name}</p>
            <p>${restaurant.restaurant.url}</p>
            <button type="button" id="${restaurant.restaurant.R.res_id}" class="js-favorite">Mark as Favorite!</button>
          </ul>
        </div>
      `);
  }) //.each


    $('.js-favorite').on('click',function(event)
    {
        var favorite = $(event.currentTarget).attr('id');
        //if(restaurantIds.length==0)
        console.log(favorite);

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
                   resUrl : restaurant.resUrl
                 })
             }
           })

            console.log(favorites);

           //restaurantIds.push(favorite);
            xhr = new XMLHttpRequest();
            var url = '/restaurants/favorites';
            //var url = '/restaurants/`${userId}`';
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function()
            {
              if (xhr.readyState == 4)
              {
                var json = JSON.parse(xhr.responseText);
            // var json = xhr.responseText
                console.log(json);
              }
            }
           var data = JSON.stringify(
           {
             'userName':`${userName}`,
             'city':`${city}`,
             'locationType':`${entity}`,
             'restaurantInfo': favorites
            })

          xhr.send(data);
       }//if
       else
       {
          console.log('Not first favorite restaurant');
          //restaurantIds.push(favorite);

          restaurantInfo.forEach(restaurant =>
          {
            if(favorite == restaurant.resId)
            {
              favorites.push(
                {
                  resId : restaurant.resId,
                  resName : restaurant.resName,
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
              //var json = JSON.parse(xhr.responseText);
              var json = xhr.responseText;
              console.log(json);
            }
          }
         var data = JSON.stringify(
         {
          // 'userId' : `${userId}`,
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
     }

   //Each page will have a 'Next' button
    $('.js-next').html(`<br><br><button id="next" role="button" type="submit">Next</button>`)

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

$(hotelSubmit);

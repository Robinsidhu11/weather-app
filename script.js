let your_weather_tab_btn=document.querySelector('[data-your_weathertab_button]')
let search_weather_tab_btn=document.querySelector('[date-search_weathertab_button]')
let grant_access_cont=document.querySelector('[data-grantaccess_container]')
let data_search_form=document.querySelector('[data-search_input_container]')
let loader_cont=document.querySelector('[data-loader_container]')
let notfound_cont=document.querySelector('[data-notfound_container]')
let show_weather_info_cont=document.querySelector('[data-show_weather_info_container]')

let grant_access_button=document.querySelector('[data-grant_access_button]')
let current_tab=your_weather_tab_btn
current_tab.classList.add("add_bg_tab_radiustoo")
let API_KEY="d1845658f92b31c64bd94f06f7188c9c";
getFromSessionStorage();
function switchTab(clicked_tab){
    // means we are switching tab from one to another
    if(clicked_tab != current_tab){
        current_tab.classList.remove("add_bg_tab_radiustoo")
        clicked_tab.classList.add("add_bg_tab_radiustoo")
        current_tab=clicked_tab
        

        if(data_search_form.classList.contains("active")){
            // switching from search tab to your weather
            notfound_cont.classList.remove("active")
            show_weather_info_cont.classList.remove("active")
            data_search_form.classList.remove("active")
            // call to check if we have long and lat. of user or no
            getFromSessionStorage()
        }
        else{
            // switching from your weather to search
            grant_access_cont.classList.remove("active")
            show_weather_info_cont.classList.remove("active")
            data_search_form.classList.add("active")
        }
       
    }
}
function getFromSessionStorage(){
    let coordinates_of_user=sessionStorage.getItem("user-coordinates")
    if(coordinates_of_user){
        // coordinates are present. fetch the weather then
        let final_cordinates=JSON.parse(coordinates_of_user)
        fetchUserWeatherInfo(final_cordinates)
    }
    else{
        grant_access_cont.classList.add("active")
    }
    
}
// using long and lat.
async function fetchUserWeatherInfo(final_cordinates){
    
    let {long,lati}=final_cordinates
    // console.log(long,lati)
    grant_access_cont.classList.remove("active")
    loader_cont.classList.add("active")
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${API_KEY}&units=metric`)
        let data=await response.json()
        
        loader_cont.classList.remove("active")
        show_weather_info_cont.classList.add("active")
        renderWeatherInfo(data)
    }
    catch(err){
        // in case location is unfounded
        
        loader_cont.classList.remove("active")
    }
}
// render data on site
function renderWeatherInfo(data){
    
    let city_name=document.querySelector('[data-city_name]')
    let country_flag=document.querySelector('[data-country_icon]')
    let name_of_weather=document.querySelector('[data-weather_nametype]')
    let weather_icon=document.querySelector('[data-weather_icon]')
    let temp_info=document.querySelector('[data-temperature_info]')
    let windspeed_info=document.querySelector('[data-windspeed_value]')
    let humidity_value=document.querySelector('[data-humidity_value]')
    let cloud_value=document.querySelector('[data-cloud_value]');

    city_name.textContent=data?.name;
    country_flag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    name_of_weather.textContent=data?.weather[0]?.main;
    weather_icon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp_info.innerHTML=data?.main?.temp+"&deg"+"C";
    windspeed_info.textContent=data?.wind?.speed+"m/s";
    humidity_value.textContent=data?.main?.humidity+"%";
    cloud_value.textContent=data?.clouds?.all+"%";

}
// pass the clicked tab to switchTab fn
your_weather_tab_btn.addEventListener('click',()=>{
    switchTab(your_weather_tab_btn)
})

// pass the clicked tab to switchTab fn
search_weather_tab_btn.addEventListener('click',()=>{
    switchTab(search_weather_tab_btn)
})
// fn to get loaction of user
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
        
      }
      else{
        
        
      }
}
function showError(error){
    let pele=document.getElementById("grant_message")
    pele.style.color="red"
    pele.style.fontSize="20px"
        pele.textContent="You denied the request for Geolocation."
}
function showPosition(position) {
    const userCoordinates = {
      lati: position.coords.latitude,
      long: position.coords.longitude,
    };
    
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
    
  }
// adding listner on grant access button to try to fetch user cordinates and update it in session storage
grant_access_button.addEventListener('click',()=>{
    getLocation()
})

let input_field=document.querySelector('[data-inputfield]')
let searchbutton=document.querySelector('[date-search_button]')

searchbutton.addEventListener("click",(e)=>{
    e.preventDefault();
    let city_name_entered=input_field.value
    input_field.value=""
    city_name_entered=city_name_entered.trim()
    
    if(city_name_entered.trim===""){
        
        return
    }
    else{
        fetchSearchWeatherInfo(city_name_entered);
    }
})

async function fetchSearchWeatherInfo(city_name_entered){
    if(city_name_entered===""){
        return
    }
    notfound_cont.classList.remove("active")
    loader_cont.classList.add("active")
    show_weather_info_cont.classList.remove("active")
    grant_access_cont.classList.remove("active")
    try{
        let res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city_name_entered}&appid=${API_KEY}&units=metric`
          );
        let data = await res.json();
        loader_cont.classList.remove("active")
        show_weather_info_cont.classList.add("active")
        renderWeatherInfo(data)
    }
    catch(e){
        loader_cont.classList.remove("active")
        notfound_cont.classList.add("active")
        show_weather_info_cont.classList.remove("active")
    }
}
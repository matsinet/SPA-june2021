import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = new Navigo(window.location.origin);

function render(st = state.Home) {
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
`;

  router.updatePageLinks();

  addEventListeners(st);
}

function addEventListeners(st) {
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach((navLink) =>
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      render(state[event.target.title]);
    })
  );

  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  // event listener for the the photo form
  if (st.view === "Form") {
    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      // construct new picture object
      let newPic = inputList.reduce((pictureObject, input) => {
        pictureObject[input.name] = input.value;
        return pictureObject;
      }, {});
      // add new picture to state.Gallery.pictures
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }

  console.log("st.view", st.view);
  if (st.view === "Order") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();

      const inputList = event.target.elements;

      const toppings = [];
      for (let input of inputList.toppings) {
        if (input.checked) {
          toppings.push(input.value);
        }
      }

      const requestData = {
        crust: inputList.crust.value,
        cheese: inputList.cheese.value,
        sauce: inputList.sauce.value,
        toppings: toppings
      };
      console.log("request Body", requestData);

      axios
      .post(`${process.env.API}/pizzas`, requestData)
      .then(response => {
        state.Pizza.pizzas.push(response.data);
        router.navigate("/Pizza");
      })
      .catch(error => {
        console.log("It puked", error);
      });
    });
  }
}

router.hooks({
  before: (done, params) => {
    const page = params && params.hasOwnProperty("page") ? capitalize(params.page) : "Home";

    switch (page) {
      case "Pizza":
        axios
          .get(`${process.env.API}/pizzas`)
          .then(response => {
            state[page].pizzas = response.data;
            done();
          })
          .catch(error => {
            console.log("I died trying to get Pizza", error);
            done();
          });
        break;
      case "Blog":
        state.Blog.posts = [];
        axios
          .get("https://jsonplaceholder.typicode.com/posts/")
          .then((response) => {
            response.data.forEach((post) => {
              state.Blog.posts.push(post);
            });
            done();
            // console.log(state.Blog.posts);
          })
          .catch((err) => console.log(err));
        break;
      case "Home":
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API_KEY}&q=st.%20louis`
          )
          .then(response => {
            console.log('weather', response);
            state.Home.weather = {};
            state.Home.weather.city = response.data.name;
            state.Home.weather.temp = response.data.main.temp;
            state.Home.weather.feelsLike = response.data.main.feels_like;
            state.Home.weather.humidity = response.data.main.humidity;
            state.Home.weather.description = response.data.weather[0]["description"];
            done();
          })
          .catch((err) => console.log(err));
        break;

      default:
        done();
    }
  },
});

router
  .on({
    "/": () => render(state.Home),
    ":page": (params) => render(state[capitalize(params.page)]),
  })
  .resolve();

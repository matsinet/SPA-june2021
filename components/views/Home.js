import html from "html-literal";
import sharksImage from "../../assets/img/SmallestShark.jpg";

const kelvinToFahrenheit = (kelvinTemp) =>
  Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

export default (st) => html`
  <section id="jumbotron">
    <h2>Savvy Coders Jan. 2020 Cohort</h2>
    <a href="" onClick="alert('Hello! You clicked the Button!')"
      >"Call to Action" "Button"</a
    >
  </section>

  <h3 id="weather">
    Temperature in ${st.weather.city} is
    ${kelvinToFahrenheit(st.weather.temp)}F, feels like
    ${kelvinToFahrenheit(st.weather.feelsLike)}F. Humidity is at
    ${st.weather.humidity}%, and the weather is ... ${st.weather.description}
  </h3>

  <!-- <img id="shark" class="cover-img" src="${sharksImage}" /> -->
`;


document.addEventListener("DOMContentLoaded", () => {

  function restoreTitleDOM(){
    document.getElementById("the-title").style.display = "inline";
    document.getElementById("edit-title").style.display = "inline";
    document.getElementById("edit-title-input").style.display = "none";
  }
  document.getElementById("edit-title").onclick = function(){
    document.getElementById("the-title").style.display = "none";
    document.getElementById("edit-title").style.display = "none";
    document.getElementById("edit-title-input").style.display = "inline";
  }
  document.getElementById("cancel-title").onclick = function(){
    restoreTitleDOM();
  }
  document.getElementById("submit-title").onclick = async ()=> {
    const newTitle = document.querySelector("#edit-title-input input").value;
    const id = document.getElementById("edit-title-input").dataset.theid;

    const update = await axios.post(`/movies/api/edit/${id}`, {title: newTitle});
    const newInfo = await axios.get(`/movies/api/details/${id}`);
    restoreTitleDOM();
    document.getElementById("the-title").innerText = newInfo.data.movie.title;
    console.log(newInfo);
  }




  function restoreGenreDOM(){
    document.getElementById("the-genre").style.display = "inline";
    document.getElementById("edit-genre").style.display = "inline";
    document.getElementById("edit-genre-input").style.display = "none";
  }
  document.getElementById("edit-genre").onclick = function(){
    document.getElementById("the-genre").style.display = "none";
    document.getElementById("edit-genre").style.display = "none";
    document.getElementById("edit-genre-input").style.display = "inline";
  }
  document.getElementById("cancel-genre").onclick = function(){
    restoreGenreDOM();
  }
  document.getElementById("submit-genre").onclick = async ()=> {
    const newGenre = document.querySelector("#edit-genre-input input").value;
    const id = document.getElementById("edit-genre-input").dataset.theid;

    const update = await axios.post(`/movies/api/edit/${id}`, {genre: newGenre});
    const newInfo = await axios.get(`/movies/api/details/${id}`);
    restoreGenreDOM();
    document.getElementById("the-genre").innerText = newInfo.data.movie.genre;
    console.log(newInfo);
  }


  function restorePlotDOM(){
    document.getElementById("the-plot").style.display = "inline";
    document.getElementById("edit-plot").style.display = "inline";
    document.getElementById("edit-plot-input").style.display = "none";
  }
  document.getElementById("edit-plot").onclick = function(){
    document.getElementById("the-plot").style.display = "none";
    document.getElementById("edit-plot").style.display = "none";
    document.getElementById("edit-plot-input").style.display = "inline";
  }
  document.getElementById("cancel-plot").onclick = function(){
    restorePlotDOM();
  }
  document.getElementById("submit-plot").onclick = async ()=> {
    const newPlot = document.querySelector("#edit-plot-input input").value;
    const id = document.getElementById("edit-plot-input").dataset.theid;

    const update = await axios.post(`/movies/api/edit/${id}`, {plot: newPlot});
    const newInfo = await axios.get(`/movies/api/details/${id}`);
    restorePlotDOM();
    document.getElementById("the-plot").innerText = newInfo.data.movie.plot;
    console.log(newInfo);
  }







  // axios.get("https://worldtimeapi.org/api/timezone/america/new_york")
  // .then((response) => {
  //   console.log(response)
  // })
  // .catch((err) => {
  //   console.log(err);
  // })  
});

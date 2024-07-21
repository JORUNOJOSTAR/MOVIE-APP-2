import axios from "axios";
import evn from "dotenv";
evn.config();

const {
    IMG_PATH,
    MOVIE_LINK,
    CATEGORY_LINK,
    SEARCHAPI,
    API_LINK
}  = process.env;

// &include_adult=true

async function returnMovies(page=1){
    return makeMovieData(API_LINK+page);
}

async function searchMovies(movieKeywords,page){
    return makeMovieData(SEARCHAPI+movieKeywords+"&page="+page);
}


async function getMovieByCategory(name,page){
    let moviedata = [];
    const categoryList = (await axios.get(CATEGORY_LINK)).data.genres;
    const reqCategoryId = categoryList.find(list => list.name.toLowerCase()==name).id;
    return await makeMovieData(API_LINK+page+"&with_genres="+reqCategoryId);
}

async function makeMovieData(apiURL){
    let movieData = [];
    await axios.get(apiURL).then(response=>{
        movieData = response.data.results.map(data=>{
            let backdrop_path = data.backdrop_path;
            return {
                "imgLink": backdrop_path!=null ? IMG_PATH + backdrop_path:"/assests/imageNotFound.png",
                "imgTitle":data.title,
                "movieId" : data.id,
            };
        });
    }).catch(error=>{
        console.log(error);
    });
    return movieData;
}

async function getMovieData(movieId){
    let movieData = {};
    await axios.get(MOVIE_LINK.replace("movieId",movieId)).then(response=>{
        let gernes = response.data.genres.slice(0,3).map(genre => genre.name);
        let posterpath = response.data.poster_path;
        movieData = {
            "title": response.data.title,
            "release_date": response.data.release_date,
            "tagline": response.data.tagline,
            "genres": gernes,
            "imgLink": posterpath!=null ? IMG_PATH + posterpath:"/assests/imageNotFound.png",
            "runtime": response.data.runtime,
            "overview": response.data.overview
        };
    }).catch(error=>{
        console.log(error);
    });

    return movieData;
}

export {returnMovies,searchMovies,getMovieByCategory,getMovieData};

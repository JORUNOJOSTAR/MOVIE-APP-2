import axios from "axios";
import evn from "dotenv";
evn.config();

const {
    IMG_PATH,
    SEARCHAPI,
    API_LINK
}  = process.env;

async function returnMovies(page=1){
    const response = await axios.get(API_LINK+page);
    const results = response.data.results;
    return makeMovieData(results);
}

async function searchMovies(movieKeywords,page){
    const response = await axios.get(SEARCHAPI+movieKeywords+"&page="+page);
    const results = response.data.results;
    return makeMovieData(results);
}


function makeMovieData(responseData){
    const movies = responseData.map(data=>{
        return {
            "imgLink":data.backdrop_path!=null?IMG_PATH + data.backdrop_path:"/assests/imageNotFound.png",
            "imgTitle":data.title
        };
    });
    return movies;
}

export {returnMovies,searchMovies};

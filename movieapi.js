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
    const movies = results.filter(
        result=>result.backdrop_path!=null
    ).map(result=>{
        return {
            "imgLink":IMG_PATH + result.backdrop_path,
            "imgTitle":result.title
        };
    });
    return movies;
}

export {returnMovies};

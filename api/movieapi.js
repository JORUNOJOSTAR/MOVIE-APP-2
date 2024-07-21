import axios from "axios";
import evn from "dotenv";
evn.config();

const {
    IMG_PATH,
    CATEGORY_LINK,
    SEARCHAPI,
    API_LINK
}  = process.env;


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
            return {
                "imgLink":data.backdrop_path!=null?IMG_PATH + data.backdrop_path:"/assests/imageNotFound.png",
                "imgTitle":data.title
            };
        });
    }).catch(error=>{
        console.log(error);
    });
    return movieData;
}

export {returnMovies,searchMovies,getMovieByCategory};

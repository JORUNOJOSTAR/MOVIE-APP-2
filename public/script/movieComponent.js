const star=`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill rating-star" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
`;

const halfstar=`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half rating-star" viewBox="0 0 16 16">
  <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z"/>
</svg>
`;

const review = `
<div class="reviewcontent">
    <div class="review-user">
        <p><%= user_name %></p>
        <div class="stars review-stars">
            <span>Rating :</span>
            <% for( let index = 0; index < review_star; index++ ) { %>
                ${star}
            <% } %>
        </div>
    </div>
    <div class="review-text">
        <p><%= review_message %></p>
    </div>
    <div class="review-reaction">
        <p class="review-datetime">
            <%= edited?"Edited on":"Review on :" %><span><%= review_datetime %></span>
        </p>
        <div class="reaction-btn">
            <div class="like-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                </svg>
                <span class="like-count"><%= like_count || "" %></span>
            </div>
            <div class="funny-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-smile-fill" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                </svg>
                <span class="funny-count"><%= funny_count || "" %></span>
            </div>
        </div>
    </div>
</div>
`;

const rating =`
<h3>Rating</h3>
<div class="rating-overview">
    <h2 class="total-rating"><%= averageRating %></h2>
    <div class="rating-details">
        <div class="stars">
        <% for( let index = 0; index < Math.floor(averageRating); index++ ) { %>
            ${star}
        <% } %>
        <% if (averageRating - Math.floor(averageRating) > 0) { %>
            ${halfstar}   
        <% } %>
        </div>
        <div class="rating-counts">
            <%= reviewCount %> reviews on this movie
        </div>
    </div>
</div>
<div class="rating-percentage">
    <div class="star-percentage">
        <p>5 star</p>
        <div class="percentage-bar bar-5">
            <div></div>
            <p><%= starAverage[4] %>%</p>
        </div>
    </div>
    <div class="star-percentage">
        <p>4 star</p>
        <div class="percentage-bar bar-4">
            <div></div>
            <p><%= starAverage[3] %>%</p>
        </div>
    </div>
    <div class="star-percentage">
        <p>3 star</p>
        <div class="percentage-bar bar-3">
            <div></div>
            <p><%= starAverage[2] %>%</p>
        </div>
    </div>
    <div class="star-percentage">
        <p>2 star</p>
        <div class="percentage-bar bar-2">
            <div></div>
            <p><%= starAverage[1] %>%</p>
        </div>
    </div>
    <div class="star-percentage">
        <p>1 star</p>
        <div class="percentage-bar bar-1">
            <div></div>
            <p><%= starAverage[0] %>%</p>
        </div>
    </div>
</div>
`;

export {star,halfstar,rating,review};
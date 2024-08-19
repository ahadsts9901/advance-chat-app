// chat socket api endpoints


// login api

// method: POST
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/login
// req-body: {email, password}


// signup api

// method: POST
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/signup
// req-body: {firstName, lastName, email, password}


// logout api

// method: POST
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/logout
// req-body: {}


// get user profile

// method: GET
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/profile/user_id


// get currentUser profile

// method: GET
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/ping


// get all users (for chat)

// method: POST
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/logout
// req-body: {}


// send message

// method: POST
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/message
// req-body: {to_id (reciever's id), chatMessage }


// get messages

// method: GET
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/messages/opponent_id
// req-params: { opponent's id }


// edit message

// method: PUT
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/message/message_id
// req-params: { message_id }
// req-body: {message}


// delete message (delete for everyone)

// method: PUT
// endpoint: https://social-media-web-0lwr.onrender.com/api/v1/message/everyone/message_id
// req-params: { message_id }
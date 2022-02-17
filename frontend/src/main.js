import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";
// Run backend port on 5010

// Navigation
document.getElementById("page-toggle-login").addEventListener("click", () => {
    document.getElementById("page-toggle-login").style.fontWeight = "bold";
    document.getElementById("page-toggle-register").style.fontWeight = "normal";
    document.getElementById("page-register").style.display = "none";
    document.getElementById("page-login").style.display = "block";
});
document.getElementById("page-toggle-register").addEventListener("click", () => {
    document.getElementById("page-toggle-register").style.fontWeight = "bold";
    document.getElementById("page-toggle-login").style.fontWeight = "normal";
    document.getElementById("page-login").style.display = "none";
    document.getElementById("page-register").style.display = "block";

});
// Login form
const checkLoginForm = (event) => {
    if (document.getElementById("email-login").value !== "" && document.getElementById("password-login").value !== "") {
        document.getElementById("login").removeAttribute("disabled");
    } else {
        document.getElementById("login").setAttribute("disabled", "");
    }
};
document.getElementById("email-login").addEventListener("keyup", checkLoginForm);
document.getElementById("password-login").addEventListener("keyup", checkLoginForm);

// Register form
const checkRegisterForm = (event) => {
    const email = document.getElementById("email-register").value;
    const name = document.getElementById("name-register").value;
    const password = document.getElementById("password-register").value;
    const confirm = document.getElementById("confirm-password").value;
    if (email !== "" && name !== "" && password !== "" && confirm !== "") {
        document.getElementById("register").removeAttribute("disabled");
    } else {
        document.getElementById("register").setAttribute("disabled", "");
    }
};
document.getElementById("email-register").addEventListener("keyup", checkRegisterForm);
document.getElementById("name-register").addEventListener("keyup", checkRegisterForm);
document.getElementById("password-register").addEventListener("keyup", checkRegisterForm);
document.getElementById("confirm-password").addEventListener("keyup", checkRegisterForm);

// Global variables 
let TOKEN = null;
let UID = null;
let PASSWORD = null;
const storeToken = (token) => {
    TOKEN = token;
};
const storeId = (uid) => {
    UID = uid;
};
const storePassword = (password) => {
    PASSWORD = password;
};

// Fetch
const apiFetch = (method, path, token, body) => {
    const requestOptions = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };
    if (token !== null) {
        requestOptions.headers["Authorization"] = `Bearer ${token}`;
    }
    return new Promise ((resolve, reject) => {
        fetch(`http://localhost:5010/${path}`, requestOptions)
        .then((response) => {
            if (response.status === 400 || response.status === 403) {
                response.json().then((errorMsg) => {
                    reject(errorMsg["error"]);
                });
            } else if (response.status === 200) {
                response.json().then(data => {
                    resolve(data);
                });
            }
        })
        .catch(err => alert(err));
    });
};

// Join channel
function joinChannel(id) {   
    apiFetch("POST", `channel/${id}/join`, TOKEN)
    .then(() => {
        getCurrentChannel(id);
    }).catch((err) => alert(err));
};

// Leave channel
function leaveChannel(id) {
    apiFetch("POST", `channel/${id}/leave`, TOKEN)
    .then(() => {
        getCurrentChannel(id);
        getHomePage();
    }).catch((err) => alert(err));
};

// Edit channel
function editChannel(id) {
    apiFetch("GET", `channel/${id}`, TOKEN)
    .then((channel) => {
        removeCurrentPage();
        const page = document.createElement("div");
        page.id = "page-current";
        page.class = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";

        const c_name = document.createElement("div");
        c_name.class = "mb-3";
        c_name.innerText = "Channel Name: ";
        const name_input = document.createElement("input");
        name_input.type = "text";
        name_input.class = "form-control";
        name_input.id = "new-channel-name";
        name_input.placeholder = channel["name"];
        c_name.appendChild(name_input);

        const c_des = document.createElement("div");
        c_des.class = "mb-3";
        c_des.innerText = "Channel Description: ";
        const des_input = document.createElement("textarea");
        des_input.class = "form-control";
        des_input.id = "new-channel-description";
        des_input.placeholder = channel["description"];
        c_des.appendChild(des_input);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.class = "btn btn-primary";
        btn.innerText = "Save";
        btn.addEventListener("click", () => {
            const name = document.getElementById("new-channel-name").value;
            const des = document.getElementById("new-channel-description").value;
            const body = {
                "name": name,
                "description": des
            };
            apiFetch("PUT", `channel/${id}`, TOKEN, body)
            .then(() => {
                getHomePage();
                getCurrentChannel(id);
            }).catch(err => alert(err));
        });
        page.appendChild(c_name);
        page.appendChild(c_des);
        page.appendChild(btn);
        document.getElementById("content").appendChild(page);
    })
    .catch(err => alert(err));
};

function removeCurrentPage() {
    if (document.getElementById("page-current") !== null) {
        document.getElementById("page-current").remove();
    }
};
// Show channel screen
const getCurrentChannel = (id) => {
    // If there is a current page, remove it
    removeCurrentPage();
    const page = document.createElement("div");
    page.id = "page-current";
    page.class = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";

    // Fetch channel details
    apiFetch("GET", `channel/${id}`, TOKEN)
    .then((channel) => {
        // Get channel details
        const title = document.createElement("a");
        title.class = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom";
        const name = document.createElement("strong");
        name.id = "channel-name";
        name.class = "px-2 fs-5 fw-semibold";
        name.innerText = "#" + channel["name"];
        title.appendChild(name);
        page.appendChild(title);

        const buttons = document.createElement("a");
        buttons.class = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom";

        const leaveButton = document.createElement("button");
        leaveButton.id = "leave-channel-btn";
        leaveButton.class = "btn btn-light";
        leaveButton.innerText = "Leave";
        leaveButton.addEventListener("click", () => {
            leaveChannel(id);
        });
        buttons.appendChild(leaveButton);
        const editButton = document.createElement("button");
        editButton.id = "edit-channel-btn";
        editButton.class = "btn btn-info";
        editButton.innerText = "Edit Channel";
        editButton.addEventListener("click", () => {
            editChannel(id);
        });
        buttons.appendChild(editButton);
        page.appendChild(buttons);

        const container = document.createElement("div");
        container.class="list-group list-group-flush border-bottom scrollarea";
        container.id = "message-list";

        const details = document.createElement("a");
        details.id = "channel-details";
        details.class = "list-group-item list-group-item-action active py-3 lh-tight";

        const description = document.createElement("p");
        description.id = "channel-description";
        description.innerText = channel["description"];
        details.appendChild(description);
        const privacy = document.createElement("p");
        if (channel["private"] === true) {
            privacy.innerText = "(Private channel)";
        } else {
            privacy.innerText = "(Public channel)";
        }
        details.appendChild(privacy);
        const createdAt = document.createElement("p");
        createdAt.innerText = "Created at: " + channel["createdAt"].substring(0, 10);
        details.appendChild(createdAt);

        container.appendChild(details);
        page.appendChild(container);
        document.getElementById("content").appendChild(page); 

        const uid = channel["creator"];
        return apiFetch("GET", `user/${uid}`, TOKEN);
    })
    .then((user) => {
        // Display channel creator name
        const creatorName = document.createElement("p");
        creatorName.innerText = "Created by: " + user["name"];
        document.getElementById("channel-details").appendChild(creatorName);
        // Add messages 
        getChannelMessages(id);
        
    }).catch(() => {
        apiFetch("GET", `channel`, TOKEN)
        .then((data) => {
            const channel = data["channels"].filter(c => c["id"] === id)[0];

            const title = document.createElement("a");
            title.class = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom";
            const name = document.createElement("strong");
            name.id = "channel-name";
            name.class = "px-2 fs-5 fw-semibold";
            name.innerText = "#" + channel["name"];
            title.appendChild(name);
            page.appendChild(title);

            const buttons = document.createElement("a");
            buttons.class = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom";
            const joinButton = document.createElement("button");
            joinButton.id = "join-channel-btn";
            joinButton.class = "btn btn-primary";
            joinButton.innerText = "Join";
            joinButton.addEventListener("click", () => {
                joinChannel(id);
            });
            buttons.appendChild(joinButton);
            page.appendChild(buttons);
            document.getElementById("content").appendChild(page);
        })
        .catch((err) => alert(err));
    });
};

function getChannelMessages(id) {
    const container = document.getElementById("message-list");
    apiFetch("GET", `message/${id}?start=0`, TOKEN)
    .then((data) => {        
        const messageList = data["messages"];
        messageList.forEach((data) => {
            const message = data;
            const uid = message["sender"];
            apiFetch("GET", `user/${uid}`, TOKEN).then((user) => {
                const msg = document.createElement("a");
                msg.id = "m-" + message["id"];
                msg.class = "list-group-item list-group-item-action active py-3 lh-tight";
                const header = document.createElement("div");
                header.class = "d-flex w-100 align-items-center justify-content-between";
    
                const sender = document.createElement("strong");
                sender.class = "mb-2 m-2 uname";
                sender.innerText = user["name"];
                sender.addEventListener("click", () => {
                    showUserProfileScreen(uid);
                });
    
                const time = document.createElement("small");
                const date = new Date(message["sentAt"]);
                const year = date.getFullYear();
                const month = date.getMonth()+1;
                const dt = date.getDate();
                const hr = date.getHours();
                const mins = date.getMinutes();
                if (dt < 10) {
                    dt = '0' + dt;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                time.innerText = "  " + hr + ":" + mins + ", " + year + '-' + month + '-' + dt;
                header.appendChild(sender);
                header.appendChild(time);
                msg.appendChild(header);
    
                const m = document.createElement("div");
                m.class = "col-10 mb-1 small";
                m.innerText = message["message"];
                msg.appendChild(m);
        
                container.appendChild(msg);
            }).catch(err => alert(err));
        });
        const chatbox = document.createElement("div");
        chatbox.id = "chatbox";
        const messageInput = document.createElement("input");
        messageInput.id = "messageInput";
        messageInput.type = "text";
        messageInput.class = "form-control";

        const sendBtn = document.createElement("div");
        sendBtn.id = "sendBtn";
        sendBtn.addEventListener("click", () => {
            const msg = document.getElementById("messageInput").value;
            const body = {
                "message": msg,
                "image": ""
            }
            apiFetch("POST", `message/${id}`, TOKEN, body)
            .then(() => {}).catch(err => alert(err));
        });
        chatbox.appendChild(messageInput);
        chatbox.appendChild(sendBtn);
        document.getElementById("page-current").appendChild(chatbox);
    }).catch((err) => alert(err));
};

function showUserProfileScreen(uid) {
    apiFetch("GET", `user/${uid}`, TOKEN)
    .then((user) => {
        removeCurrentPage();
        const page = document.createElement("div");
        page.id = "page-current";
        page.class = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";

        const title = document.createElement("a");
        title.class = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom";
        const name = document.createElement("strong");
        name.class = "px-2 fs-5 fw-semibold";
        name.innerText = user["name"];
        title.appendChild(name);
        page.appendChild(title);

        const u_bio = document.createElement("div");
        u_bio.class = "mb-3";
        if (user["bio"] !== null) {
            u_bio.innerText = "Bio: " + user["bio"];
        } else {
            u_bio.innerText = "Bio: User doesn't have a bio.";
        }
        
        const u_email = document.createElement("div");
        u_email.class = "mb-3";
        u_email.innerText = "Email: " + user["email"];

        const u_image = document.createElement("div");
        u_image.class = "mb-3";
        const profile = document.createElement("img");
        profile.class = "profile-image";
        if (user["image"] !== null) {
            profile.src = user["image"];
        } else {
            profile.src = "./styles/default-user-icon.jpg";
        }
        u_image.appendChild(profile);

        page.appendChild(u_email);
        page.appendChild(u_bio);
        page.appendChild(u_image);
        document.getElementById("content").appendChild(page);
    }).catch(err => alert(err));
};

// Remove all channels from sidebar
function cleanChannels() {
    const element = document.getElementById("public-channels");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    const element2 = document.getElementById("private-channels");
    while (element2.firstChild) {
        element2.removeChild(element2.firstChild);
    }
};
function showMainPage() {
    $("#main").removeClass("d-none");
};

function hideMainPage() {
    // hide main page
    $("#main").addClass("d-none");
};

// Get homepage/sidebar
function getHomePage() {
    cleanChannels();
    // Add channel to sidebar
    apiFetch("GET", `channel`, TOKEN)
    .then(data => {
        const channelList = data["channels"];
        channelList.forEach((channel) => {
            let cid = channel["id"];
            const wrapper = document.createElement("li");
            const c = document.createElement("a");
            c.class = "link-dark rounded";
            c.id = "c-" + cid;
            c.innerText = channel["name"];
            c.addEventListener("click", () => {
                getCurrentChannel(cid);
            });
            wrapper.appendChild(c);
            const isPrivate = channel["private"];
            if (isPrivate) {
                if (channel["members"].includes(UID)) {
                    document.getElementById("private-channels").appendChild(wrapper);
                }
            } else {
                document.getElementById("public-channels").appendChild(wrapper);
            }
        });
    })
    .catch(err => alert(err));
    // Show page
    showMainPage();
};

// Registration
document.getElementById("register").addEventListener("click", () => {
    // Get form value
    const email = document.getElementById("email-register").value;
    const name = document.getElementById("name-register").value;
    const password = document.getElementById("password-register").value;
    const confirm = document.getElementById("confirm-password").value;
    // Check if passwords match
    if (confirm !== password) {
        alert("Passwords do not match! Please enter the same passwords.");
    } else {
        const body = {
            "email": email,
            "name": name,
            "password": password,
        };
        // Request
        apiFetch("POST", `auth/register`, null, body)
        .then(data => {
            storeToken(data["token"]);
            storeId(data["userId"]);
            storePassword(password);
            // Hide register page
            document.getElementById("navbar").style.display = "none";
            document.getElementById("page-register").style.display = "none";
            getHomePage();
        }).catch((err) => alert(err));
    }
});

// Login
document.getElementById("login").addEventListener("click", () => {
    // Get form details
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;
    const body = {
        "email": email,
        "password": password,
    };
    // Request
    apiFetch("POST", `auth/login`, null, body)
    .then(data => {
        storeToken(data["token"]);
        storeId(data["userId"]);
        storePassword(password);
        // Hide login page
        document.getElementById("navbar").style.display = "none";
        document.getElementById("page-login").style.display = "none";
        getHomePage();
    })
    .catch(err => alert(err));
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    apiFetch("POST", `auth/logout`, TOKEN)
    .then(() => {
        cleanChannels();
        hideMainPage();
        // Show login page
        document.getElementById("navbar").style.display = "block";
        document.getElementById("page-login").style.display = "block";
    })
    .catch(err => alert(err));
});

// Create channel
document.getElementById("create-channel-btn").addEventListener("click", () => {
    removeCurrentPage();
    const page = document.createElement("div");
    page.id = "page-current";
    page.class = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";

    const c_name = document.createElement("div");
    c_name.class = "mb-3";
    c_name.innerText = "Channel Name: ";
    const name_input = document.createElement("input");
    name_input.type = "text";
    name_input.class = "form-control";
    name_input.id = "new-channel-name";
    c_name.appendChild(name_input);

    const c_private = document.createElement("div");
    c_private.class = "mb-3";
    c_private.innerText = "Channel Privacy: ";
    const select = document.createElement("select");
    select.class = "form-select";
    const op1 = document.createElement("option");
    op1.selected = true;
    op1.id = "public-channel";
    op1.innerText = "Public";
    const op2 = document.createElement("option");
    op2.selected = false;
    op2.id = "private-channel";
    op2.innerText = "Private";
    select.appendChild(op1);
    select.appendChild(op2);
    c_private.appendChild(select);

    const c_des = document.createElement("div");
    c_des.class = "mb-3";
    c_des.innerText = "Channel Description: ";
    const des_input = document.createElement("textarea");
    des_input.class = "form-control";
    des_input.id = "new-channel-description";
    des_input.value = "";
    c_des.appendChild(des_input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.class = "btn btn-primary";
    btn.innerText = "Submit";
    btn.addEventListener("click", () => {
        const name = document.getElementById("new-channel-name").value;
        const des = document.getElementById("new-channel-description").value;
        const p = document.getElementById("private-channel").selected;
        if (name === "") {
            alert("Channel name cannot be empty!");
        } else {
            const body = {
                "name": name,
                "private": p,
                "description": des
            };
            apiFetch("POST", `channel`, TOKEN, body)
            .then((data) => {
                getHomePage();
                getCurrentChannel(data["channelId"]);            
            })
            .catch(err => alert(err));
        }
    });
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.class = "btn btn-secondary";
    cancel.innerText = "Cancel";
    cancel.addEventListener("click", () => {
        removeCurrentPage();
    });
    page.appendChild(c_name);
    page.appendChild(c_private);
    page.appendChild(c_des);
    page.appendChild(btn);
    page.appendChild(cancel);
    document.getElementById("content").appendChild(page);
});

document.getElementById("my-profile").addEventListener("click", () => {
    apiFetch("GET", `user/${UID}`, TOKEN)
    .then((user) => {
        removeCurrentPage();
        const page = document.createElement("div");
        page.id = "page-current";
        page.class = "d-flex flex-column align-items-stretch flex-shrink-0 bg-white";

        const title = document.createElement("a");
        title.class = "d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom";
        const name = document.createElement("strong");
        name.class = "px-2 fs-5 fw-semibold";
        name.innerText = "My Profile";
        title.appendChild(name);
        page.appendChild(title);

        const u_name = document.createElement("div");
        u_name.class = "mb-3";
        u_name.innerText = "Username: ";
        const name_input = document.createElement("input");
        name_input.disabled = true;
        name_input.type = "text";
        name_input.value = user["name"];
        name_input.id = "user-name";
        u_name.appendChild(name_input);

        const u_bio = document.createElement("div");
        u_bio.class = "mb-3";
        u_bio.innerText = "Bio: ";
        const bio_input = document.createElement("textarea");
        bio_input.disabled = true;
        bio_input.value = user["bio"];
        bio_input.id = "user-bio";
        u_bio.appendChild(bio_input);
        
        const u_email = document.createElement("div");
        u_email.class = "mb-3";
        u_email.innerText = "Email: ";
        const email_input = document.createElement("input");
        email_input.disabled = true;
        email_input.type = "email";
        email_input.value = user["email"];
        email_input.id = "user-email";
        u_email.appendChild(email_input);

        const u_password = document.createElement("div");
        u_password.class = "mb-3";
        u_password.innerText = "Password: ";
        const p_input = document.createElement("input");
        p_input.disabled = true;
        p_input.type = "password";
        p_input.value = PASSWORD;
        p_input.id = "user-password";
        u_password.appendChild(p_input);
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.innerText = "Show/Hide";
        toggle.addEventListener("click", () => {
            const password = document.getElementById("user-password");
            const type = password.type === "password" ? "text" : "password";
            password.type = type;
        });
        u_password.appendChild(toggle);

        const u_image = document.createElement("div");
        u_image.class = "mb-3";
        const profile = document.createElement("img");
        profile.id = "image-profile";
        profile.class = "profile-image";
        if (user["image"] !== null) {
            profile.src = user["image"];
        } else {
            profile.src = "./styles/default-user-icon.jpg";
        }
        u_image.appendChild(profile);

        const image_upload = document.createElement("input");
        image_upload.type = "file";
        image_upload.style.display = "none";
        image_upload.accept = "image/png, image/jpeg, image/jpg";
        u_image.appendChild(image_upload);

        const save_btn = document.createElement("button");
        save_btn.style.display = "none";
        save_btn.innerText = "Save Changes";
        save_btn.type = "button";
        save_btn.class = "btn btn-primary";
        save_btn.addEventListener("click", () => {
            const name = document.getElementById("user-name").value;
            const email = document.getElementById("user-email").value;
            const password = document.getElementById("user-password").value;
            const bio = document.getElementById("user-bio").value;
            const file = document.querySelector('input[type="file"]').files[0];
            let image = null;
            if (typeof file !== "undefined") {
                image = fileToDataUrl(file);
            }
            const body = {
                "email": email,
                "password": password,
                "name": name,
                "bio": bio,
                "image": image
            }
            apiFetch("PUT", `user`, TOKEN, body)
            .then(() => {
                image_upload.style.display = "none";
                document.getElementById("user-name").disabled = true;
                document.getElementById("user-email").disabled = true;
                document.getElementById("user-password").disabled = true;
                document.getElementById("user-bio").disabled = true;
                save_btn.style.display = "none";
            }).catch(err => alert(err));
        });
        const edit_btn = document.createElement("button");
        edit_btn.type = "button";
        edit_btn.class = "btn btn-primary";
        edit_btn.innerText = "Edit";
        edit_btn.addEventListener("click", () => {
            document.getElementById("user-name").disabled = false;
            document.getElementById("user-email").disabled = false;
            document.getElementById("user-password").disabled = false;
            document.getElementById("user-bio").disabled = false;
            image_upload.style.display = "block";
            save_btn.style.display = "block";
        });

        page.appendChild(edit_btn);
        page.appendChild(u_name);
        page.appendChild(u_bio);
        page.appendChild(u_email);
        page.appendChild(u_password);
        page.appendChild(u_image);
        page.appendChild(save_btn);
        document.getElementById("content").appendChild(page);
    })
    .catch(err => alert(err));
});

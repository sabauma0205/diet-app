const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const authResult = document.getElementById("authResult");

const SUPABASE_URL = "https://mujjplqnlozykzholpjx.supabase.co";
const SUPABASE_KEY = "sb_publishable_MFQ0w2P-Cabsb9OuoEZ6AQ_MgBe5g2r";

const supabaseClient =
    window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
//新規登録
signupButton.addEventListener("click", async function(){

    const email = emailInput.value;
    const password = passwordInput.value;

    if(email == "" || password == ""){
        authResult.textContent = "メールアドレスとパスワードを入力してください。";
        return;
    }

    const{data,error} = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });
    if(error){
        authResult.textContent = error.message;
        return;
    }
    authResult.textContent = "確認メールを送信しました。メールを確認してください。";
});

//ログイン
loginButton.addEventListener("click", async function () {

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email === "" || password === "") {
        authResult.textContent =
            "メールアドレスとパスワードを入力してください";
        return;
    }

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        authResult.textContent =
            "メールアドレスまたはパスワードが違います";
        return;
    }

    authResult.textContent = "ログインしました";

    window.location.href = "index.html";
});


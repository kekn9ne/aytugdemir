

const firebaseConfig = {
    apiKey: "AIzaSyCw52qViV_HL0PJAkYYtr0Wp547lMyS6I8",
    authDomain: "vocabulary-2e274.firebaseapp.com",
    projectId: "vocabulary-2e274",
    storageBucket: "vocabulary-2e274.appspot.com",
    messagingSenderId: "968274961474",
    appId: "1:968274961474:web:b8180202ea7f6192c1f9db",
    measurementId: "G-1QRJHS9KLZ"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Kullanıcı girişi ve çıkışı
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert('Sign Up Successful');
        })
        .catch(error => {
            alert(error.message);
        });
}

function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('wordbook-section').style.display = 'block';
            loadWords();
        })
        .catch(error => {
            alert(error.message);
        });
}

function signOut() {
    auth.signOut().then(() => {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('wordbook-section').style.display = 'none';
    });
}

// Kelime ekleme
function addWord() {
    const word = document.getElementById('new-word').value;
    const meaning = document.getElementById('meaning').value;
    const user = auth.currentUser;

    if (word && meaning && user) {
        db.collection('users').doc(user.uid).collection('words').add({
            word: word,
            meaning: meaning
        }).then(() => {
            alert('Word added!');
            loadWords();
        });
    }
}

// Kelime listeleme
function loadWords() {
    const user = auth.currentUser;
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';

    db.collection('users').doc(user.uid).collection('words').get().then(snapshot => {
        snapshot.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = `${doc.data().word}: ${doc.data().meaning}`;
            wordList.appendChild(li);
        });
    });
}

// Sözlük API'si
async function fetchWordMeaning() {
    const word = document.getElementById('new-word').value;
    if (!word) return;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        if (data[0] && data[0].meanings[0]) {
            document.getElementById('meaning').value = data[0].meanings[0].definitions[0].definition;
        } else {
            alert('No meaning found');
        }
    } catch (error) {
        alert('Error fetching meaning');
    }
}

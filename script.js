const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');
const checkButton = document.getElementById('check');

// Function to store in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Function to get a random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to clear local storage
function clearStorage() {
  localStorage.clear();
}

// Function to generate SHA256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Function to get or generate a SHA256 hash
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (!cached) {
    const randomNum = getRandomArbitrary(MIN, MAX).toString();
    cached = await sha256(randomNum);
    store('sha256', cached);
    store('originalNumber', randomNum); // Store original number for debugging
  }
  return cached;
}

// Main function to initialize the hash display
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Function to test the user input
async function test() {
  const pin = pinInput.value;
  if (pin.length !== 3) {
    resultView.innerHTML = '💡 not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const hashedPin = await sha256(pin);
  const storedHash = retrieve('sha256');

  if (hashedPin === storedHash) {
    resultView.innerHTML = '🎉 success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ failed';
  }
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach the test function to the button
checkButton.addEventListener('click', test);

// Run the main function on first load
main();
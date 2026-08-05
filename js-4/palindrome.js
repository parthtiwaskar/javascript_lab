// palindrome.js
const input = document.getElementById('inputText');
const btn = document.getElementById('checkBtn');
const result = document.getElementById('result');

function isPalindrome(str) {
  const cleaned = str.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  return cleaned === cleaned.split('').reverse().join('');
}

btn.addEventListener('click', () => {
  const text = input.value;
  if (!text) {
    result.textContent = 'Please enter some text.';
    result.style.color = '#ff6b6b';
    return;
  }
  const palindrome = isPalindrome(text);
  result.textContent = palindrome ? `"${text}" is a palindrome!` : `"${text}" is not a palindrome.`;
  result.style.color = palindrome ? '#4caf50' : '#ff6b6b';
});

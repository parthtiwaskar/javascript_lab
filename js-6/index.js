const form = document.getElementById("myForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // ==========================================
  // GET INPUT VALUES
  // ==========================================

  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const paragraph = document.getElementById("paragraph").value.trim();
  const prn = document.getElementById("prn").value.trim();

  const result = document.getElementById("result");

  // Clear previous result
  result.innerHTML = "";

  // ==========================================
  // CHECK EMPTY FIELDS
  // ==========================================

  if (email === "") {
    alert("Please enter an email.");
    return;
  }

  if (phone === "") {
    alert("Please enter a phone number.");
    return;
  }

  if (paragraph === "") {
    alert("Please enter a paragraph.");
    return;
  }

  // ==========================================
  // REGULAR EXPRESSIONS
  // ==========================================

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone number - exactly 10 digits
  const phonePattern = /^\d{10}$/;

  const prnPattern = /^\d{11}$/;
  // Find email inside paragraph
  const emailFindPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

  // Find numbers inside paragraph
  const numberPattern = /\d+/g;

  // ==========================================
  // 1. VALIDATE EMAIL
  // ==========================================

  let emailStatus;

  if (emailPattern.test(email)) {
    emailStatus = "Valid";
  } else {
    emailStatus = "Invalid";
  }

  // ==========================================
  // 2. VALIDATE PHONE NUMBER
  // ==========================================

  let phoneStatus;

  if (phonePattern.test(phone)) {
    phoneStatus = "Valid - Exactly 10 digits";
  } else {
    phoneStatus = "Invalid - Must contain exactly 10 digits";
  }

  let prnStatus;

  if (prnPattern.test(prn)) {
    prnStatus = "Valid - Exactly 11 digits";
  } else {
    prnStatus = "Invalid - Must contain exactly 11 digits";
  }
  // ==========================================
  // 3. COUNT TOTAL WORDS
  // ==========================================

  const words = paragraph.match(/\b\w+\b/g);

  const totalWords = words ? words.length : 0;

  // ==========================================
  // 4. COUNT TOTAL NUMBERS
  // ==========================================

  const numbers = paragraph.match(numberPattern);

  const totalNumbers = numbers ? numbers.length : 0;

  // ==========================================
  // 5. CONVERT ENTIRE TEXT TO LOWERCASE
  // ==========================================

  const lowercaseText = paragraph.toLowerCase();

  // ==========================================
  // 6. REPLACE COMPUTER SCIENCE
  //    WITH INFORMATION TECHNOLOGY
  // ==========================================

  const replacedText = paragraph.replace(
    /computer science/gi,
    "Information Technology",
  );

  // ==========================================
  // 7. EXTRACT EMAIL FROM PARAGRAPH
  // ==========================================

  const extractedEmailMatch = paragraph.match(emailFindPattern);

  const extractedEmail = extractedEmailMatch
    ? extractedEmailMatch[0]
    : "No email found";

  // ==========================================
  // 8. EXTRACT PHONE NUMBER FROM PARAGRAPH
  // ==========================================

  const extractedPhoneMatch = paragraph.match(/\b\d{10}\b/);

  const extractedPhone = extractedPhoneMatch
    ? extractedPhoneMatch[0]
    : "No 10-digit phone number found";

  // ==========================================
  // 9. REVERSE EMAIL
  // ==========================================

  let reversedEmail = "";

  if (extractedEmail !== "No email found") {
    for (let i = extractedEmail.length - 1; i >= 0; i--) {
      reversedEmail += extractedEmail[i];
    }
  } else {
    reversedEmail = "Not available";
  }

  // ==========================================
  // 10. REVERSE ENTIRE PARAGRAPH
  // ==========================================

  let reversedParagraph = "";

  for (let i = paragraph.length - 1; i >= 0; i--) {
    reversedParagraph += paragraph[i];
  }

  // ==========================================
  // 11. FIND EMAIL POSITION
  // ==========================================

  const emailPosition = paragraph.indexOf(extractedEmail);

  // ==========================================
  // DISPLAY RESULT
  // ==========================================

  result.innerHTML = `

        <div class="result-box">

            <h2>Validation & Text Analysis Result</h2>


            <div class="section">

                <h3>1. Validation</h3>

                <p>
                    <strong>Entered Email:</strong>
                    ${email}
                </p>

                <p>
                    <strong>Email Status:</strong>
                    <span class="${
                      emailStatus === "Valid" ? "valid" : "invalid"
                    }">
                        ${emailStatus}
                    </span>
                </p>

                <p>
                    <strong>Entered Phone:</strong>
                    ${phone}
                </p>

                <p>
                    <strong>Phone Status:</strong>
                    <span class="${
                      phoneStatus.startsWith("Valid") ? "valid" : "invalid"
                    }">
                        ${phoneStatus}
                    </span>
                </p>

            </div>


            <div class="section">

                <h3>2. Extracted Information</h3>

                <p>
                    <strong>Extracted Email:</strong>
                    ${extractedEmail}
                </p>

                <p>
                    <strong>Extracted Phone:</strong>
                    ${extractedPhone}
                </p>

                <p>
                    <strong>Email Position:</strong>
                    ${emailPosition}
                </p>

            </div>


            <div class="section">

                <h3>3. Text Statistics</h3>

                <p>
                    <strong>Total Words:</strong>
                    ${totalWords}
                </p>

                <p>
                    <strong>Total Numbers:</strong>
                    ${totalNumbers}
<p>
    <strong>PRN:</strong>
    ${prn}
</p>

<p>
    <strong>PRN Status:</strong>
    <span class="${prnStatus.startsWith("Valid") ? "valid" : "invalid"}">
        ${prnStatus}
    </span>
</p>
            </div>


            <div class="section">

                <h3>4. Text Transformation</h3>

                <p>
                    <strong>Lowercase Text:</strong>
                </p>

                <div class="text-output">
                    ${lowercaseText}
                </div>


                <p>
                    <strong>After Replacement:</strong>
                </p>

                <div class="text-output">
                    ${replacedText}
                </div>

            </div>


            <div class="section">

                <h3>5. Reversed Text</h3>

                <p>
                    <strong>Reversed Email:</strong>
                    ${reversedEmail}
                </p>

                <p>
                    <strong>Reversed Paragraph:</strong>
                </p>

                <div class="text-output">
                    ${reversedParagraph}
                </div>

            </div>

        </div>
    `;
});

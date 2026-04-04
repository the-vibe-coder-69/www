const waitlistForm = document.querySelector("#waitlistForm");
const formNote = document.querySelector("#formNote");

if (waitlistForm) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(waitlistForm);
    const email = formData.get("email");
    const city = formData.get("city");
    const role = formData.get("role");

    const subject = encodeURIComponent("LastMinute Waitlist Request");
    const body = encodeURIComponent(
      `Hi,\n\nI want early access to LastMinute.\n\nEmail: ${email}\nCity: ${city}\nUse case: ${role}\n\nPlease keep me updated when this category/city opens.\n`
    );

    formNote.textContent = "Opening your email app so you can send the waitlist request.";
    window.location.href = `mailto:thevibecoder69@gmail.com?subject=${subject}&body=${body}`;
  });
}

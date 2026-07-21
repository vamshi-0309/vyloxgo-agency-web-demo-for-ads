(function () {
  // ============================================================
  // 1) Set this to your Google Apps Script Web App URL once you've
  //    followed the setup steps in js/README-sheet-setup.md
  //    Until you do, the form still works — it just falls back to
  //    opening an email instead of writing to a sheet.
  // ============================================================
  const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyEMJWFJ0ViBkp0wnl-HUMAM61CgW1JHy8jR-ONocYmDgM6Ofgz1FJQNPcPMJAArYzb/exec";

  const form = document.getElementById('contactForm');
  if (!form) return;

  const businessType = document.getElementById('businessType');
  const otherGroup = document.getElementById('otherTypeGroup');
  const otherInput = document.getElementById('otherType');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  businessType.addEventListener('change', () => {
    const isOther = businessType.value === 'Other';
    otherGroup.style.display = isOther ? 'block' : 'none';
    otherInput.required = isOther;
  });

  function setError(fieldEl, hasError) {
    const group = fieldEl.closest('.field-group');
    group.classList.toggle('has-error', hasError);
    fieldEl.classList.toggle('invalid', hasError);
  }

  function validate() {
    let ok = true;
    const name = document.getElementById('fullName');
    const biz = document.getElementById('businessName');
    const phone = document.getElementById('phone');

    if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);
    if (!biz.value.trim()) { setError(biz, true); ok = false; } else setError(biz, false);

    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) { setError(phone, true); ok = false; } else setError(phone, false);

    if (!businessType.value) { setError(businessType, true); ok = false; } else setError(businessType, false);

    if (businessType.value === 'Other' && !otherInput.value.trim()) {
      setError(otherInput, true); ok = false;
    } else if (businessType.value === 'Other') {
      setError(otherInput, false);
    }

    return ok;
  }

  function buildPayload() {
    const type = businessType.value === 'Other'
      ? otherInput.value.trim()
      : businessType.value;
    return {
      name: document.getElementById('fullName').value.trim(),
      business: document.getElementById('businessName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      businessType: type,
      source: 'vyloxgo-website',
      submittedAt: new Date().toISOString(),
    };
  }

  function mailtoFallback(payload) {
    const subject = encodeURIComponent(`New enquiry: ${payload.business}`);
    const body = encodeURIComponent(
      `Name: ${payload.name}\nBusiness: ${payload.business}\nPhone: ${payload.phone}\nType: ${payload.businessType}`
    );
    window.location.href = `mailto:vylox@gmail.com?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = buildPayload();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      // 1) Save to local backend CSV (for local host testing)
      try {
        await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (localErr) {
        console.warn('Local CSV backend save failed:', localErr);
      }

      // 2) Save to Google Sheets if configured
      const configured = WEBHOOK_URL && !WEBHOOK_URL.startsWith('PASTE_');
      if (configured) {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      } else {
        // Fallback email client trigger if Google Sheets isn't set up yet
        mailtoFallback(payload);
      }

      form.style.display = 'none';
      formSuccess.classList.add('show');
    } catch (err) {
      formError.classList.add('show');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit details';
    }
  });
})();


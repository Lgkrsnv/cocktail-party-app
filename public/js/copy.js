
  const copyTextareaBtn = document.querySelector('.js-textareacopybtn');
  const copyBtn = document.querySelector('#copyBtn');
  if (copyTextareaBtn) {
    copyTextareaBtn.addEventListener('click', function (event) {
      const copyTextarea = document.querySelector('.js-copytextarea');
      if (copyTextarea) {
        copyTextarea.focus();
        copyTextarea.select();

        try {
          let successful = document.execCommand('copy');
          let msg = successful ? 'successful' : 'unsuccessful';
          copyBtn.innerText = 'Copied!'
        } catch (err) {
          console.log('Oops, unable to copy');
        }
      }

    });
  }

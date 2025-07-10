Fancy.copyText = (text) => {
  if(navigator.clipboard){
    navigator.clipboard.writeText(text)
      .catch(err => console.error('Error copying: ', err));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

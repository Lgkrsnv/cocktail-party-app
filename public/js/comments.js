const showCommentsBtn = document.querySelector('.showCommentsBtn');

if (showCommentsBtn) {
  showCommentsBtn.addEventListener('click', async (e) => {
    const partyid = showCommentsBtn.id;
    const getComments = await fetch(`/parties/comments/${partyid}`);
    const commentsHTML = await getComments.text();
    const commentsDiv = document.querySelector('#commentsDiv');
    commentsDiv.innerHTML = commentsHTML;
    showCommentsBtn.remove();

    const deleteBtns = document.querySelectorAll('.deteteBtn');
    if (deleteBtns) {
      for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', async (e) => {
          const commentid = e.target.id;
          const deleteIt = await fetch(`/parties/comments/${partyid}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              commentid
            }),
          });
          const isDeleted = await deleteIt.json();
          e.target.parentNode.parentNode.remove();
        })
      }
    }

    const sendCommentForm = document.querySelector('#sendCommentForm'); 
    if (sendCommentForm) {
      sendCommentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('submit !');
        const partyid = document.querySelector(".sendCommentsBtn").id;
        const comment = e.target.commentTextArea.value;
        const responseSendCom = await fetch(`/parties/comments/${partyid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
          }),
        })
        const result = await responseSendCom.json();
        console.log(result);
        if (result.status === 'ok') {
          const commentsBlock = document.querySelector("#commentsBlock");
          const div = document.createElement('div');
          div.classList.add('commentItem')
          const div1 = document.createElement('div');
          div1.id = 'avatar'
          const img = document.createElement('img');

          img.src = '/avatars/' + result.avatar;
          img.style.width = '100px';
          div1.appendChild(img);
          const div2 = document.createElement('div')
          div2.classList.add('com');
          const pUser = document.createElement('p');
          pUser.classList.add('pUser');
          const pComment = document.createElement('p');
          pComment.classList.add('pComment')
          const pJustNow = document.createElement('p');
          pJustNow.classList.add('pJustNow')
          pUser.innerText = result.user;
          pComment.innerText = comment;
          pJustNow.innerText = 'Отправлено только что';
          div2.appendChild(pUser)
          div2.appendChild(pComment)
          div2.appendChild(pJustNow);
          div.appendChild(div1);
          div.appendChild(div2);
          const div3 = document.createElement('div')
          div3.classList.add('deleteBtnDiv');
          div3Content = `<button class="btn btn-outline-dark deteteBtn deteteBtnNew" id="${partyid}">Delete</button>`
          div3.innerHTML = div3Content;
          commentsBlock.appendChild(div);
          div.appendChild(div3);
          const floatingTextarea2 = document.querySelector("#floatingTextarea2").value = '';
          const deteteBtnNew = document.querySelector('.deteteBtnNew');
          if (deteteBtnNew) {
            deteteBtnNew.addEventListener('click', async (e) => {
              const commentid = e.target.id;
              const deleteIt = await fetch(`/parties/comments/${partyid}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  commentid
                }),
              });
              await deleteIt.json();
              e.target.parentNode.parentNode.remove();
            })
          }
        }
      })
    }
  })
}

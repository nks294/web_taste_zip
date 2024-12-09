/*회원가입 관련 아이디 중복 검사와 유효성검사
 */

//아이디 중복검사
$(function(){
	
	$("#checkId").on("click", function(){
		
		const member_id = $("#member_id").val();
		
		if(member_id.length === 0){
			alert("아이디가 입력되지 않았습니다.");
			frmJoin.member_id.focus();
		}else{
			
			$.ajax({//ajax(): 비동기통신을 할 수 있도록 지원하는 메소드
				type:"post", //서버로 요청하는 방식
				url:"checkId.do", //서보로 보낼 url
				data:{"member_id": member_id}, //서버로 보낼 데이터
				success: function(resData){ //요청에 대한 응답이 성공적으로 이루어진 경우
					const msg = $("#resultMsg");
					msg.show();//중복검사 결과를 띄우는 div를 보이게 함
					
					//유의사항: 응답내용에서 공백을 제거해줘야 정상적인 결과값을 얻어서 처리할 수 있음
					if(resData.trim() === "PASS"){//trim(): 앞 뒤 공백 제거
						msg.html("사용 가능한 아이디입니다.").css("color", "green");
						
						//중복검사 버튼을 메일 인증 버튼으로 바꾸고 메일인증 버튼을 클릭하면 메일 보내기
						const checkIdBtn = $("#checkId");
						checkIdBtn.val("메일인증");
						checkIdBtn.attr("id", "email_auth_btn").on("click", function(){
							msg.hide();
							sendEmail();
						});
						
					}else{
						msg.html("이미 사용중인 아이디입니다.").css("color", "red");
						$("#member_id").val("").trigger("focus");//trigger("이벤트이름")
						//이벤트를 강제로 발생시킴
					}
				},
				error: function(error){ //요청에 대한 응답이 실패한 경우
					console.log("아이디 중복검사 중 에러 발생");
				    console.log(error);
				}
			});//end of ajax
			
		}	
		
	});
	
	
///// Email 인증관련 추가 구문 ////	
let code;
const checkInput = $("#auth_num_input");//인증번호 입력 input
const confirmEmailBtn = $("#confirm_email_btn");//인증확인 버튼
const resultMsg = $("#resultEmail");//인증결과 출력 div 

function sendEmail(){
	const email = $("#member_id").val();//메일 주소
	
	$.ajax({
		type: "post",
		url: "checkEmail.do",
		data: {email: email},
		success: function(data){
			checkInput.attr("disabled", false);//인증번호 입력란을 활성화시킴
			code=data.trim();//공백 제거 후 서버에서 받은 인증번호를 code에 저장
			alert("인증번호가 전송되었습니다");
		},
		error: function(e){
			console.log("인증번호 받기 중 에러발생");
		}
	
	});

}

//사용자가 자신의 메일에서 인증번호를 확인한 후 인증번호 입력란에 인증번호를 입력하고 난 뒤
//인증확인 버튼을 클릭한 경우 처리 구문
confirmEmailBtn.on("click", function(){
	
	const inputCode = checkInput.val(); //인증번호 입력란에 입력된 값
	resultMsg.show(); //결과 출력 div 화면에 보이게 하기
	const resultEmailAuth = $("#result_confirm");//인증결과를 넘겨줄 input hidden 태그
	
	if(inputCode === code){//입력된 인증번호와 서버에서 받은 인증코드가 일치하면
		resultMsg.html("정상적으로 인증되었습니다");
		resultMsg.css("color", "green");
		resultEmailAuth.val("PASS"); //메일인증 성공(유효성 검사시 사용)
	
	}else{
		resultMsg.html("인증번호가 일치하지 않습니다. 다시 확인해 주세요");
		resultMsg.css("color", "red");
		resultEmailAuth.val("FAIL"); //메일인증 실패(유효성 검사시 사용)
	}
});

//입력 커서가 비밀번호에 놓여지면 메시지를 보이지 않도록 함
	$("#member_pw").on("focus", ()=>{
		const msg = $("#resultMsg");
		if(msg.text() === "사용 가능한 아이디입니다." &&
		resultMsg.text() === "정상적으로 인증되었습니다"){
			msg.hide();
			resultMsg.hide();
			
			//인증번호를 지우고 인증번호 입력란과 인증번호 버튼 비활성화
			checkInput.val("");
			checkInput.attr("disabled", true);
			confirmEmailBtn.attr("disabled", true);
		}
	});


	
	
	
	
});

<h1 align="center">Weather Wear</h1>
<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/styled components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
  <img src="https://img.shields.io/badge/antd-f7495b?style=flat-square&logo=antdesign&logoColor=white"/>
  <img src="https://img.shields.io/badge/firebase-yellow?style=flat-square&logo=firebase&logoColor=white"/>

</p>
<p align="center">
<img width="50%" src="https://user-images.githubusercontent.com/59003343/226093255-bf3b1091-d8da-46c2-942f-b178a720706f.png">
</p>



## 📖  프로젝트 설명 
### 👉🏻 [배포사이트 보러가기](https://weather-wear.netlify.app/)
- 옷을 사도 사도 왜 입을 옷이 없지? 작년 이맘때 쯤 나는 뭘 입고 다녔을까? 갑자기 추워졌는데 뭘 입어야할까? 라는 고민을 매 계절이 변할 때 마다 하는 것 같습니다. 
- 그래서 매일 그날그날의 기온에 따른 옷차림을 추천해주고, 기온과 입은 옷을 함께 기록해두면 좋겠다는 생각에서 개발하게 되었습니다.
- __기온별 옷 추천/기록 및 기록을 토대로 어떤 브랜드를 선호하고, 어떤 종류의 옷이 많고 또 자주입는지 분석하는 서비스를 제공합니다.__
<br/>

## 📸  Preview
<details>
  <summary>Guest - 메인화면</summary>
  <img width="50%" alt="스크린샷 2023-03-18 오후 5 15 43" src="https://user-images.githubusercontent.com/59003343/226183109-af6db37b-9eac-4223-a3cf-bfad9c7f5151.png"><br/>
  - 로그인하지 않을 경우 기온에맞는 이미지, 텍스트로 옷 추천
</details>
<details>
  <summary>회원 - 메인화면</summary>
  <img width="50%" alt="스크린샷 2023-03-19 오후 5 02 03" src="https://user-images.githubusercontent.com/59003343/226183234-e6eddaaf-5b14-4927-b11f-574b388b1d2c.png"><br/>
  - 로그인 시, 저장된 옷이 있으면 저장된 옷 중 기온에 맞는 옷을 골라서 추천 <br/>
  - 랜덤버튼 클릭 시, 추천옷 리스트에서 랜덤 배치 <br/>
  - [최종결정]버튼 클릭 시, 오늘입은 옷으로 등록 👉🏻 월간기록 캘린더 등록 및 분석하기 메뉴에서 활용됨
  <img width="50%" alt="스크린샷 2023-03-19 오후 5 02 19" src="https://user-images.githubusercontent.com/59003343/226183533-477f50a7-87ca-4abc-8500-67e7dbfbc793.png"><br/>
  - [다른거입을래]버튼 클릭 시, 기온에 맞는 추천리스트에서 직접선택 가능
</details>
<details>
  <summary>옷장화면</summary>
  <div style="dispaly: flex">
  <img width="45%" alt="스크린샷 2023-03-19 오후 11 59 21" src="https://user-images.githubusercontent.com/59003343/226184652-9748f084-c69a-48c1-acd2-96fe15f1df35.png">
  <img width="45%" alt="스크린샷 2023-03-20 오전 12 00 24" src="https://user-images.githubusercontent.com/59003343/226184660-607fc783-e192-4667-a072-dbbaed7806a5.png">
  </div>
  - [옷넣기]버튼 클릭 시, 네이버 쇼핑API를 통해 상품 검색 <br/>
  - [담기]버튼 클릭 시 옷장등록 <br/>
  - 저장된 옷리스트 카테고리별 분류 <br/>
</details>
<details>
  <summary>옷장분석 화면</summary>
    <img width="50%" alt="스크린샷 2023-03-20 오전 12 00 41" src="https://user-images.githubusercontent.com/59003343/226184657-00d15f29-5b10-455f-b4a0-6594c63f7ab2.png"> <br/>
  - 카테고리별, 브랜드별 옷장 점유율 차트로 선호브랜드 및 선호상품군 분석<br/>
  - 브랜드별/카테고리별 착용횟수 차트로 어떤 브랜드의 어떤 상품군을 많이 착용했는지 분석<br/>
  - 가장 많이 착용한 상품, 가장 적게 착용한 상품 랭킹<br/>
</details>
<details>
  <summary>월간기록 화면</summary>
  <img width="50%" alt="스크린샷 2023-03-20 오전 12 01 00" src="https://user-images.githubusercontent.com/59003343/226184656-25e443c5-4ae5-4348-8efc-f2825268c575.png"><br/>
  - 캘린더로 월간 입은 옷 기록 확인
  - 날짜별로 클릭 시 입은 옷 저장 시의 시간대, 기온, 날씨, 위치정보 확인
</details>

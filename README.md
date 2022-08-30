![header](https://capsule-render.vercel.app/api?type=rounded&color=auto&height=120&section=header&text=GrinMarket&fontSize=70)

<div align="center">
    <br />
    <div>
      <img height="70" src="./public/image/logo.png" />
    </div>
    <a display="block" href="hhttps://girn-market.vercel.app/" >
      https://girn-market.vercel.app/
    </a>
    <br />
</div>

## Content

- 🛠 [Built with](#built-with)
- 🚀 [Project](#project)
- 📖 [Pages](#pages)
- ✓ [Features](#features)
- 🔥 [Code](#code)

---

## Built with

### Front-end

- `Next JS`
- `Typescript`
- `tailwindCSS`
- `Framer-motion`
- `swr`
- `CloudFlare`

### Back-end

- `Next JS`
- `Prisma`
- `Planet Scale`

### Deploy

- `Vercel`

## Project

→ 업로드된 상품을 구매(페이크)하거나 찜목록에 추가 혹은 상품을 판매(페이크)할 수 있으며,  
 커뮤니티를 통해 서로 다른 사람과 코멘트를 남겨 이야기할 수 있습니다.

✓ 모든 `이미지는 CloudFlare`에 저장됩니다.

> 네비게이션

- 로그아웃 또는 로그인(로그인 여부), 아바타가 있습니다.
- 아바타를 통해 유저 프로필을 확인할 수 있고 로그인 유저라면, 로그아웃을 할 수 있습니다.
- 업로드와 Product(home), Community페이지를 확인할 수 있습니다.

> 1. 로그인

- 간편하게 유저네임과 이메일을 입력하고, 메일로 토큰을 받고 검증하여 로그인 합니다.  
  (본 프로젝트는 메일을 통한 토큰 검증은 생략했습니다.)
- `iron-session`을 통해 유저를 인증하여 로그인됩니다.
  <br /><br />

> 2.  Product

- 아이템들을 확인할 수 있습니다.
- 찜목록에 추가할 수 있으며, `좋아요`를 할 수 있습니다.
  <br /><br />

> 3. 검색

- 상품 이름(제목)으로 검색할 수 있습니다.
- 관련 상품들을 확인할 수 있습니다.
  <br /><br />

> 4. 업로드

- 상품 이름(제목), 가격, 설명, 이미지를 입력하여 업로드 할 수 있습니다.
- 이미지는 미리보기를 통해 업로드할 수 있습니다.
  <br /><br />

> 5. About Product (상세정보)

- 이미지에 마우스를 hover하여 상세정보를 확인할 수 있습니다.
- `좋아요`와 찜목록을 할 수 있고, 구매를 클릭하여 구매할 수 있습니다.(페이크)
- Review를 작성할 수 있습니다.
  <br /><br />

> 6. Edit Product (상품 수정)

- 상품 수정은 프로필 `Product` 컴폰넌트에서 확인할 수 있습니다.
- 제목(이름), 가격, 설명, 이미지를 변경할 수 있습니다.
- 상품을 삭제할 수 있습니다.
  <br /><br />

> 7. Communication (게시글)

- 게시글을 업로드할 수 있습니다.
- `좋아요`를 할 수 있습니다.
- 상세페이지에서 해당 게시물에 대하여 댓글을 작성할 수 있습니다.
- 자기자신의 댓글을 삭제할 수 있습니다.
  <br /><br />

> 8. Edit post (게시글 수정)

- 자신이 게시한 게시글(post)는 수정페이지로 이동할 수 있습니다.
- 게시글과, 이미지를 업데이트할 수 있습니다.
  <br /><br />

> 9. 프로필

- 유저가 게시한 상품, 게시글과 유저에 대한 정보를 확인할 수 있습니다.
- 찜목록, 구매목록(페이크), 판매목록(페이크)은 로그인한 유저 자기자신만 확인할 수 있습니다.
- 해당 유저는 프로필 수정페이지로 이동할 수 있습니다.
  <br /><br />

> 10. 프로필 수정

- 아바타 미리보기를 통해 이미지를 업데이트할 수 있습니다.
- 유저네임, 이메일 등 유저의 정보를 변경할 수 있습니다.
- 계정을 삭제할 수 있습니다.
  <br /><br />

## Pages

- 로그인

> 홈

- 상품 목록 및 커뮤니케이션
- 검색
- 업로드

> product

- 상세페이지
- 상품 수정
- 리뷰작성

> communication

- 게시글 작성
- 댓글 작성

> User

- 프로필
- 프로필 수정

<br /><br />

## Features

### 🌈 Shop

- Info
- 리뷰작성
- 좋아요, 찜목록 추가
- 구매(페이크)
- 샵 수정 (포토 미리보기, 삭제)
  <br />

### 💻 Community

- 게시글 업로드
- 게시글 삭제 및 수정
- 게시글에 대한 댓글 작성 및 삭제
  <br />

### 🙋‍♂️ User

- 로그인
- 아바타 업로드 (포토 미리보기)
- 프로필 수정 (포토 미리보기, 삭제)
- 회원정보 변경
- 찜목록, 업로드상품, 구매목록(페이크), 판매목록(페이크) 확인
  <br />

## Code

<a href="https://github.com/jangth0655/nextjs-girnmarket">🔥 GitHub</a>

# e-Apostille Verification 작업 안내서

이 문서는 이 프로젝트를 처음 보는 분도 바로 수정할 수 있도록 쉽게 정리한 설명서입니다.

이 사이트는 `e-Apostille` 확인 화면처럼 보이도록 만든 작업용 페이지입니다.
가장 자주 하는 일은 아래 3가지입니다.

1. PDF 파일 바꾸기
2. 로고 이미지 바꾸기
3. `data.json` 내용 바꾸기

중요:
실제 데이터 파일 이름은 `data.json`이 아니라 `src/data/mockData.json` 입니다.
이 파일이 사실상 이 프로젝트의 데이터 목록 파일입니다.

## 1. 폴더 구조 한눈에 보기

가장 자주 보는 폴더는 아래 2곳입니다.

- `public`
  여기에 PDF, 로고, 아이콘 같은 "파일 자체"를 넣습니다.
- `src/data`
  여기에 어떤 PDF를 어떤 번호와 연결할지 적는 데이터 파일이 있습니다.

## 2. 파일들이 어디에 있는지

### PDF 파일 위치

PDF 파일은 모두 `public` 폴더 안에 넣습니다.

현재 들어있는 예시는 아래와 같습니다.

- `public/parkmin.pdf`
- `public/park kmin.pdf`
- `public/e-registryapostillegov.phe-apostilleq=26e-00169252.pdf`
- `public/e-registryapostillegov.phe-apostilleq=26e-00169254.pdf`

중요:
웹 화면에서 PDF를 불러올 때는 `public` 폴더 기준으로 읽습니다.
예를 들어 `public/parkmin.pdf` 파일을 화면에서 연결할 때는 아래처럼 적습니다.

```json
"/parkmin.pdf"
```

앞에 `/`가 꼭 있어야 합니다.

### 로고 / 아이콘 위치

화면 상단과 브라우저 아이콘에 쓰는 이미지 파일도 `public` 폴더 안에 있습니다.

- `public/Logo.png`
  상단 큰 로고
- `public/Logo.svg`
  로고 원본 또는 대체용 파일
- `public/shield_icon.png`
  검증 표시 옆의 방패 아이콘
- `public/favicon.png`
  브라우저 탭에 보이는 작은 아이콘

현재 화면에서는 주로 아래 파일들을 사용합니다.

- 상단 로고: `Logo.png`
- 방패 아이콘: `shield_icon.png`

## 3. 가장 중요한 파일: data.json

실제 수정 파일:
`src/data/mockData.json`

이 파일에는 "어떤 문서 번호가 들어오면 어떤 PDF를 보여줄지"가 적혀 있습니다.

예시:

```json
{
  "serialNumber": "26e-00169252",
  "signedBy": "Rogelio T. Galera, Jr",
  "capacity": "Regional Director",
  "sealOf": "Commission on Higher Education",
  "verifiedDate": "2026-04-16",
  "pdfUrl": "/e-registryapostillegov.phe-apostilleq=26e-00169252.pdf",
  "pageUrl": "e-registryapostillegov.phe-apostilleq=26e-00169252"
}
```

### 각 항목 설명

- `serialNumber`
  문서 번호입니다.
  왼쪽 정보 카드의 `Serial Number`에 보입니다.

- `signedBy`
  누가 서명했는지 적는 칸입니다.
  왼쪽 정보 카드의 `Signed By`에 보입니다.

- `capacity`
  서명자의 직책입니다.
  왼쪽 정보 카드의 `Capacity`에 보입니다.

- `sealOf`
  어느 기관 문서인지 적는 칸입니다.
  왼쪽 정보 카드의 `Seal Of`에 보입니다.

- `verifiedDate`
  검증 날짜처럼 관리하는 값입니다.
  현재 화면에서 크게 보이지 않을 수 있지만, 기록용으로 같이 맞춰 두는 것이 좋습니다.

- `pdfUrl`
  어떤 PDF 파일을 띄울지 적는 칸입니다.
  반드시 `public` 폴더 안 파일명과 정확히 같아야 합니다.
  예: `"/parkmin.pdf"`

- `pageUrl`
  주소창으로 들어왔을 때 어떤 데이터를 찾을지 구분하는 값입니다.
  쉽게 말해 "이 문서를 찾기 위한 주소용 이름"입니다.

## 4. PDF 하나 추가하는 가장 쉬운 방법

예를 들어 새 PDF 파일 이름이 `kim.pdf` 라고 하면 아래 순서대로 하면 됩니다.

1. 새 PDF 파일을 `public/kim.pdf` 로 넣습니다.
2. `src/data/mockData.json` 파일을 엽니다.
3. 맨 아래에 새 항목 1개를 추가합니다.

예시:

```json
{
  "serialNumber": "26e-00170000",
  "signedBy": "Hong Gil Dong",
  "capacity": "Director",
  "sealOf": "Department of Example",
  "verifiedDate": "2026-04-26",
  "pdfUrl": "/kim.pdf",
  "pageUrl": "e-registryapostillegov.phe-apostilleq=26e-00170000"
}
```

중요:

- `pdfUrl`의 파일명은 실제 파일명과 한 글자도 틀리면 안 됩니다.
- PDF 파일명을 너무 길게 하거나 띄어쓰기를 넣으면 헷갈릴 수 있으니 가능하면 짧고 단순하게 쓰는 것을 권장합니다.
- 새 항목을 여러 개 넣을 때는 JSON 문법 때문에 쉼표 `,` 위치를 조심해야 합니다.

## 5. 로고 바꾸는 방법

### 상단 큰 로고 바꾸기

현재 상단 로고는 `public/Logo.png` 를 사용합니다.

같은 이름으로 덮어쓰면 가장 간단합니다.

즉:

1. 새 로고 준비
2. 파일 이름을 `Logo.png` 로 맞춤
3. `public` 폴더 안 기존 `Logo.png` 대신 넣기

### 방패 아이콘 바꾸기

방패 아이콘은 `public/shield_icon.png` 입니다.
이것도 같은 이름으로 바꾸면 됩니다.

## 6. 화면에 어떤 정보가 어디서 나오는지

- 상단 로고: `public/Logo.png`
- 검증 방패 아이콘: `public/shield_icon.png`
- 왼쪽 문서 정보:
  `src/data/mockData.json` 안의 `serialNumber`, `signedBy`, `capacity`, `sealOf`
- 오른쪽 PDF 미리보기:
  `src/data/mockData.json` 안의 `pdfUrl`

## 7. 실행 방법

처음 한 번 설치:

```bash
npm install
```

실행:

```bash
npm run dev
```

실행 후 브라우저에서 아래 주소를 열면 됩니다.

```text
http://localhost:5173
```

## 8. 주소 연결 방식 쉽게 이해하기

이 프로젝트는 주소에 들어있는 값을 보고 맞는 데이터를 찾습니다.

쉽게 말하면:

- 주소용 이름: `pageUrl`
- 화면에 보여줄 PDF: `pdfUrl`
- 화면에 보여줄 문서 번호: `serialNumber`

즉, 한 세트라고 생각하시면 편합니다.

## 9. 수정할 때 가장 많이 하는 실수

아래 4가지만 조심하면 대부분 문제없이 작업할 수 있습니다.

1. `pdfUrl` 파일명과 실제 PDF 파일명이 다름
2. `public` 폴더가 아닌 다른 곳에 PDF를 넣음
3. `pageUrl` 값을 너무 이상하게 입력해서 주소 연결이 꼬임
4. `mockData.json`에서 쉼표를 잘못 넣음

## 10. 현재 참고할 실제 파일들

- 데이터 파일:
  `src/data/mockData.json`
- 주소와 데이터 연결 로직:
  `src/data/records.js`
- 상단 로고와 전체 화면:
  `src/App.jsx`
- 왼쪽 정보 카드:
  `src/components/LeftCard.jsx`
- 오른쪽 PDF 미리보기:
  `src/components/PdfPreview.jsx`

## 11. 한 줄 요약

작업 순서는 거의 항상 아래와 같습니다.

1. PDF를 `public` 폴더에 넣기
2. `src/data/mockData.json`에서 `pdfUrl`, `pageUrl`, `serialNumber` 등 수정하기
3. 필요하면 `Logo.png` 같은 이미지 파일 바꾸기
4. 실행해서 화면 확인하기

## 12. 참고

이 프로젝트는 작업용 데모 화면입니다.
공식 정부 사이트 원본이 아니므로 운영 또는 제출용으로 사용할 때는 별도 확인이 필요합니다.

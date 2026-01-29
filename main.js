const diagnosisQuestions = [
  {
    id: "goal",
    title: "지금 가장 정리하고 싶은 상담 방향은 무엇인가요?",
    options: ["진학/전형 흐름 파악", "학습 방향 재정리", "학교·학년 전환 대비", "아직 잘 모르겠어요"],
  },
  {
    id: "stage",
    title: "현재 아이의 상황과 가장 가까운 설명은 무엇인가요?",
    options: ["학습 계획이 필요한 단계", "전형/진로 선택이 막막한 단계", "목표는 있지만 실행이 어려운 단계", "상담이 필요한지부터 확인 중"],
  },
  {
    id: "support",
    title: "가장 도움받고 싶은 영역은 어디인가요?",
    options: ["학습 루틴 정리", "진학 전략 정리", "학교 생활/활동 방향", "부모 역할 가이드"],
  },
  {
    id: "time",
    title: "상담을 고려하는 시점은 언제인가요?",
    options: ["지금 바로", "1~2달 내", "다음 학기 전", "상황을 보고 결정"],
  },
  {
    id: "format",
    title: "선호하는 상담 방식이 있나요?",
    options: ["온라인이 편해요", "오프라인이 편해요", "상관없어요", "아직 결정 못했어요"],
  },
];

const initDiagnosis = () => {
  const container = document.getElementById("diagnosis");
  if (!container) return;

  const questionTitle = document.getElementById("questionTitle");
  const optionList = document.getElementById("optionList");
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const skipBtn = document.getElementById("skipBtn");
  const progressBar = document.getElementById("progressBar");

  const answers = {};
  let currentIndex = 0;

  const updateProgress = () => {
    const percent = ((currentIndex + 1) / diagnosisQuestions.length) * 100;
    progressBar.style.width = `${percent}%`;
  };

  const setNextEnabled = (enabled) => {
    if (enabled) {
      nextBtn.classList.remove("btn-disabled");
    } else {
      nextBtn.classList.add("btn-disabled");
    }
  };

  const renderQuestion = () => {
    const question = diagnosisQuestions[currentIndex];
    questionTitle.textContent = question.title;
    optionList.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-card";
      button.textContent = option;
      if (answers[question.id] === index) {
        button.classList.add("selected");
      }
      button.addEventListener("click", () => {
        answers[question.id] = index;
        renderQuestion();
        setNextEnabled(true);
      });
      optionList.appendChild(button);
    });

    setNextEnabled(typeof answers[question.id] === "number");
    backBtn.disabled = currentIndex === 0;
    updateProgress();
  };

  const goNext = (useSkip = false) => {
    const question = diagnosisQuestions[currentIndex];
    if (!useSkip && typeof answers[question.id] !== "number") {
      return;
    }

    if (currentIndex < diagnosisQuestions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      const payload = {
        submittedAt: new Date().toISOString(),
        answers,
      };
      localStorage.setItem("diagnosisAnswers", JSON.stringify(payload));
      window.location.href = "result.html";
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
    }
  };

  nextBtn.addEventListener("click", () => goNext(false));
  skipBtn.addEventListener("click", () => goNext(true));
  backBtn.addEventListener("click", goBack);

  renderQuestion();
};

document.addEventListener("DOMContentLoaded", initDiagnosis);

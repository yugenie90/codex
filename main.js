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

const initResult = () => {
  const kickerEl = document.getElementById("resultKicker");
  const titleEl = document.getElementById("resultTitle");
  if (!kickerEl || !titleEl) return;

  const raw = localStorage.getItem("diagnosisAnswers");
  if (!raw) return;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return;
  }

  const goalIndex = parsed?.answers?.goal;
  const stageIndex = parsed?.answers?.stage;
  const supportIndex = parsed?.answers?.support;
  const timeIndex = parsed?.answers?.time;
  const formatIndex = parsed?.answers?.format;

  const goalKicker = [
    "진학 흐름 정리 단계예요",
    "학습 루틴 재정비 단계예요",
    "학년 전환 대비 단계예요",
    "상황 정리가 우선이에요",
  ];

  const goalTitle = [
    "전형 흐름을 함께 보는 상담이 잘 맞을 수 있어요",
    "학습 방향 재정리 상담이 어울려요",
    "전환 계획을 함께 세우는 상담이 도움될 수 있어요",
    "현재 위치부터 함께 정리해보는 상담이 좋아요",
  ];

  const stageKicker = [
    "학습 계획 준비 단계예요",
    "전형/진로 선택 단계예요",
    "실행 전략 점검 단계예요",
    "상담 필요 여부 점검 단계예요",
  ];

  const stageTitle = [
    "로드맵을 함께 잡아보는 상담이 적합해요",
    "선택지를 정리하는 상담이 도움이 될 수 있어요",
    "실행 전략을 다듬는 상담이 어울려요",
    "현 상황을 점검하는 상담이 좋아요",
  ];

  const supportKicker = [
    "학습 루틴 정리가 중요해요",
    "진학 전략 정리가 필요해요",
    "학교 생활 방향 정리가 필요해요",
    "부모 역할 가이드가 필요해요",
  ];

  const supportTitle = [
    "학습 루틴 재정비 중심 상담이 좋아요",
    "진학 전략 정리에 초점을 둔 상담이 어울려요",
    "학교 생활/활동 방향을 함께 정리하는 상담이 적합해요",
    "부모 역할 가이드를 포함한 상담이 도움이 될 수 있어요",
  ];

  const timePhrase = [
    "지금 상담을 고려 중이에요",
    "1~2달 내 상담 계획이에요",
    "다음 학기 전 정리가 필요해요",
    "상황을 보며 결정할 예정이에요",
  ];

  const formatPhrase = [
    "온라인 기준으로 맞춰볼게요",
    "오프라인 기준으로 맞춰볼게요",
    "상담 방식은 유연하게 조정해요",
    "상담 방식을 함께 결정해요",
  ];

  const primaryKicker =
    (typeof goalIndex === "number" && goalKicker[goalIndex]) ||
    (typeof stageIndex === "number" && stageKicker[stageIndex]) ||
    "진단 결과를 바탕으로";

  const primaryTitle =
    (typeof goalIndex === "number" && goalTitle[goalIndex]) ||
    (typeof supportIndex === "number" && supportTitle[supportIndex]) ||
    (typeof stageIndex === "number" && stageTitle[stageIndex]) ||
    "이런 상담이 잘 맞을 수 있어요";

  const secondaryKicker =
    (typeof supportIndex === "number" && supportKicker[supportIndex]) ||
    (typeof timeIndex === "number" && timePhrase[timeIndex]) ||
    "";

  const formatSuffix =
    (typeof formatIndex === "number" && formatPhrase[formatIndex]) || "";

  const kickerText = secondaryKicker
    ? `${primaryKicker} · ${secondaryKicker}`
    : primaryKicker;
  kickerEl.textContent = `${kickerText}.`;
  titleEl.textContent = formatSuffix
    ? `${primaryTitle} ${formatSuffix}`
    : primaryTitle;
};

document.addEventListener("DOMContentLoaded", initDiagnosis);
document.addEventListener("DOMContentLoaded", initResult);

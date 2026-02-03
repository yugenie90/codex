const diagnosisQuestions = [
  {
    id: "goal",
    title: "지금 가장 고민인 부분은 무엇인가요?",
    options: ["진학/전형 흐름 파악", "학습 방향 재정리", "학교·학년 전환 대비", "아직 잘 모르겠어요"],
  },
  {
    id: "stage",
    title: "현재 학생의 상황과 가장 가까운 설명은 무엇인가요?",
    options: ["학습 계획이 필요한 단계", "전형/진로 선택이 막막한 단계", "목표는 있지만 실행이 어려운 단계", "상담이 필요한지부터 확인 중"],
  },
  {
    id: "support",
    title: "가장 도움받고 싶은 영역은 어디인가요?",
    options: ["국어", "영어", "수학", "탐구과목"],
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

const buildResultCopy = (answers = {}) => {
  const goalEyebrowMap = [
    "진학/전형 흐름을 정리할 타이밍이에요",
    "학습 방향을 재정비할 시점이에요",
    "학교·학년 전환을 대비할 때예요",
    "현재 상황부터 차근히 정리해봐요",
  ];

  const stageEyebrowMap = [
    "학습 계획의 큰 그림을 잡는 단계예요",
    "진로/전형 선택지를 정리하는 단계예요",
    "목표는 있지만 실행을 다듬는 단계예요",
    "상담 필요성을 점검하는 단계예요",
  ];

  const goalHeadlineMap = [
    "진학/전형 흐름 정리 상담이",
    "학습 방향 재정리 상담이",
    "학교·학년 전환 대비 상담이",
    "현 상황 정리 상담이",
  ];

  const stageHeadlineFallback = [
    "학습 계획 설계 상담이",
    "진로/전형 선택 상담이",
    "실행 전략 점검 상담이",
    "현 상황 점검 상담이",
  ];

  const stageCopyMap = [
    {
      lead: "학습 계획의 우선순위를 함께 세우는 접근이 필요해요.",
      bullets: [
        "현재 학습 루틴과 목표 수준을 먼저 정리해요.",
        "실행 가능한 계획을 짧게 쪼개서 시작해요.",
      ],
    },
    {
      lead: "전형/진로 선택지를 구조화하는 정리가 중요해요.",
      bullets: [
        "가능한 전형을 분류해 비교 기준을 만들어요.",
        "필수 준비 항목을 체크리스트로 정리해요.",
      ],
    },
    {
      lead: "목표와 실행 사이의 간격을 줄이는 전략이 필요해요.",
      bullets: [
        "현재 실천을 막는 요인을 먼저 파악해요.",
        "주간 목표를 현실적인 루틴으로 설계해요.",
      ],
    },
    {
      lead: "상담이 필요한지부터 가볍게 점검하는 흐름이 좋아요.",
      bullets: [
        "현재 고민의 핵심을 한 문장으로 정리해요.",
        "상담 범위를 짧게 설정해 부담을 줄여요.",
      ],
    },
  ];

  const goalLabelMap = [
    "진학/전형 흐름",
    "학습 방향 재정리",
    "학교·학년 전환 대비",
    "목표 탐색",
  ];

  const stageActionLabelsMap = [
    ["루틴 점검", "계획 설계"],
    ["전형 비교", "진로 선택"],
    ["실행 점검", "습관 설계"],
    ["상담 필요성", "핵심 고민 정리"],
  ];

  const formatSuffixMap = [
    "온라인으로도 충분히 진행할 수 있어요.",
    "오프라인 중심으로 맞춰볼게요.",
    "상담 방식은 상황에 맞게 유연하게 정해요.",
    "상담 방식을 함께 결정해도 좋아요.",
  ];

  const formatLabelMap = ["온라인", "오프라인", "방식 유연", "방식 미정"];

  const timePrefixMap = [
    "지금 바로 상담을 고려 중이에요.",
    "1~2달 안에 상담을 계획하고 있어요.",
    "다음 학기 전까지 정리가 필요해요.",
    "상황을 보며 시점을 정하려고 해요.",
  ];

  const timeLabelMap = ["지금 바로", "1~2달 내", "다음 학기 전", ""];

  const goalIndex = answers?.goal;
  const stageIndex = answers?.stage;
  const timeIndex = answers?.time;
  const formatIndex = answers?.format;

  const isGoalUnknown = goalIndex === 3;
  const eyebrow =
    (isGoalUnknown && typeof stageIndex === "number"
      ? stageEyebrowMap[stageIndex]
      : goalEyebrowMap[goalIndex]) || "진단 결과를 바탕으로";

  const headlineStem =
    (typeof goalIndex === "number" && goalHeadlineMap[goalIndex]) ||
    (typeof stageIndex === "number" && stageHeadlineFallback[stageIndex]) ||
    "맞춤 상담이";
  const formatSuffix =
    (typeof formatIndex === "number" && formatSuffixMap[formatIndex]) || "";
  const headline = formatSuffix
    ? `${headlineStem} 잘 맞을 수 있어요. ${formatSuffix}`
    : `${headlineStem} 잘 맞을 수 있어요.`;

  const stageCopy =
    (typeof stageIndex === "number" && stageCopyMap[stageIndex]) ||
    stageCopyMap[0];
  const timePrefix =
    (typeof timeIndex === "number" && timePrefixMap[timeIndex]) || "";
  const boxLead = timePrefix
    ? `${timePrefix} ${stageCopy.lead}`
    : stageCopy.lead;

  const labels = [];
  const goalLabel =
    (typeof goalIndex === "number" && goalLabelMap[goalIndex]) || "맞춤 상담";
  labels.push(goalLabel);

  const stageLabels =
    (typeof stageIndex === "number" && stageActionLabelsMap[stageIndex]) ||
    stageActionLabelsMap[0];
  stageLabels.forEach((label) => labels.push(label));

  const formatLabel =
    (typeof formatIndex === "number" && formatLabelMap[formatIndex]) ||
    "방식 유연";
  labels.push(formatLabel);

  const timeLabel =
    (typeof timeIndex === "number" && timeLabelMap[timeIndex]) || "";
  if (timeLabel) labels.push(timeLabel);

  const trimmedLabels = labels.filter(Boolean).slice(0, 4);
  if (trimmedLabels.length === 0) trimmedLabels.push("맞춤 상담");

  return {
    eyebrow,
    headline,
    boxLead,
    labels: trimmedLabels,
  };
};

const initResult = () => {
  const kickerEl = document.getElementById("resultKicker");
  const titleEl = document.getElementById("resultTitle");
  const boxLeadEl = document.getElementById("resultBoxLead");
  const chipsEl = document.getElementById("resultChips");
  if (!kickerEl || !titleEl || !boxLeadEl || !chipsEl) return;

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

  const copy = buildResultCopy(parsed?.answers);
  kickerEl.textContent = copy.eyebrow;
  titleEl.textContent = copy.headline;
  boxLeadEl.textContent = copy.boxLead;
  chipsEl.innerHTML = "";
  copy.labels.forEach((label) => {
    const chip = document.createElement("span");
    chip.className = "summary-chip";
    chip.textContent = label;
    chipsEl.appendChild(chip);
  });

  const examples = [
    { goal: 0, stage: 1, support: 2, time: 0, format: 0 },
    { goal: 3, stage: 0, support: 1, time: 2, format: 3 },
    { goal: 2, stage: 2, support: 0, time: 1, format: 1 },
  ];
  console.log("[result copy examples]");
  examples.forEach((example, index) => {
    console.log(`case ${index + 1}`, buildResultCopy(example));
  });
};

document.addEventListener("DOMContentLoaded", initDiagnosis);
document.addEventListener("DOMContentLoaded", initResult);

export const email = "gitanshkothari@gmail.com";
export const nav = [
  { title: "Work", href: "/projects", aliases: "work projects" },
  { title: "Experience", href: "/experience", aliases: "experience career" },
  { title: "About", href: "/about", aliases: "about profile" },
  { title: "Contact", href: "/contact", aliases: "contact email" },
];
export const sections = [
  "Overview",
  "My contribution",
  "System / Architecture",
  "Engineering decisions",
  "Results",
  "Limitations & next steps",
];
export const sectionId = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/ +/g, "-");
export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  status: string;
  tags: string[];
  image: string;
  caption: string;
  repo: string;
  quick: string;
  body: string[][];
  metrics?: { value: string; label: string }[];
  gallery?: { src: string; caption: string }[];
  video?: string;
};
export const projects: Project[] = [
  {
    slug: "multi-task-driving-perception",
    title: "Multi-task driving perception",
    summary:
      "Object detection and drivable-area segmentation. One forward pass.",
    role: "Model architecture & training pipeline",
    status: "Experimental project",
    tags: ["PyTorch", "YOLOv5", "ONNX"],
    image: "/media/perception.webp",
    caption:
      "Actual detection and segmentation output from the project portfolio.",
    repo: "https://github.com/GitanshKothari/yolov5_segmentation",
    quick:
      "I extended YOLOv5 with a drivable-area segmentation branch so that detection and segmentation share a forward pass. The work spans dataset preparation, aligned augmentation, joint training and export. Reported experimental results demonstrate useful binary segmentation alongside more modest detection performance. This is an experimental perception model, not a deployed driving system.",
    body: [
      [
        "A driving scene contains two related questions: what is in front of the vehicle, and where is the drivable area? This project brings those tasks into a shared YOLOv5-based model.",
        "BDD100K images and Scalabel annotations provide the preparation context. Bounding boxes and segmentation masks must remain aligned through the entire pipeline.",
      ],
      [
        "I modified the model architecture, data loaders, loss functions and inference scripts to support the second task. The contribution includes adding the segmentation branch, aligning augmentations and supporting ONNX export.",
      ],
      [
        "Input image → shared visual features → detection head + segmentation branch.",
        "Detection predicts object boxes and classes; the segmentation branch produces a binary drivable-area mask. Joint losses train both tasks within the same pipeline.",
      ],
      [
        "Sharing features avoids maintaining two independent inference pipelines. It also makes the balance between the detection and segmentation losses an explicit engineering decision.",
        "Geometric augmentation must transform the image, bounding boxes and mask together. Export is part of the workflow, rather than a claim that the model is production-ready.",
      ],
      [
        "The final experimental run reports peak drivable-area IoU of 0.797, detection mAP@0.5 of 0.357 and mAP@0.5:0.95 of 0.182. These are reported peaks; they should not be interpreted as a single checkpoint’s simultaneous scores.",
      ],
      [
        "Detection performance remains modest, and segmentation is binary. There is no claim of temporal fusion, multi-camera inference or production deployment.",
        "Next steps include investigating task balance and validating generalization under difficult lighting before making deployment claims.",
      ],
    ],
    metrics: [
      { value: "0.797", label: "Peak drivable-area IoU" },
      { value: "0.357", label: "Detection mAP@0.5" },
      { value: "0.182", label: "Detection mAP@0.5:0.95" },
    ],
  },
  {
    slug: "scholarspace-ai",
    title: "ScholarSpace AI",
    summary:
      "A classroom coding platform that helps students work through problems.",
    role: "Team project · software & AI integration",
    status: "Archived prototype · deployment inactive",
    tags: ["TypeScript", "React", "PostgreSQL"],
    image: "/media/scholarspace.webp",
    caption: "Original ScholarSpace AI interface from the project portfolio.",
    repo: "https://github.com/hitarthdesai/scholar-space-ai",
    quick:
      "ScholarSpace AI brings assignments, an embedded coding editor, code execution and contextual hints into a classroom workflow. This was a team project, and the product and system described here are shared work. The assistant is intended to guide independent problem-solving rather than reveal solutions. The prototype is archived and the original deployment is inactive.",
    body: [
      [
        "Teachers create classrooms and coding assignments. Students work in an embedded editor, execute their code and request help in the context of the current problem.",
        "The goal is a shorter path between getting stuck and understanding the next step, while retaining the classroom workflow.",
      ],
      [
        "I contributed as part of the team developing the classroom platform and AI-assisted coding experience. Product behavior and architecture are presented as team work, rather than sole ownership.",
      ],
      [
        "Classroom assignment → embedded editor → code execution and contextual assistance.",
        "The interface connects the assignment and current code to assistance; persistent classroom and assignment data are managed with PostgreSQL.",
      ],
      [
        "Hints should support the student’s reasoning without handing over the answer. Context selection is therefore part of the product behavior, not simply a chat box beside an editor.",
        "Execution and assistance are distinct stages. Their latency measurements should not be conflated.",
      ],
      [
        "Internal verification reported an average response time of 2.22 seconds and a time to first token of 560 milliseconds. A separate approximately 300 ms request-fulfillment figure has a different or unresolved measurement boundary and is not presented as end-to-end latency.",
        "These internal checks are not evidence of user scale or a completed formal beta.",
      ],
      [
        "The prototype is archived and the original deployment is inactive. The source remains available for inspection; there is no live-product launch action.",
        "Further work would include clearer measurement boundaries and formal evaluation of hint quality in classroom use.",
      ],
    ],
  },
  {
    slug: "deepreplication",
    title: "DeepReplication",
    summary:
      "Understanding model architectures by implementing their moving parts.",
    role: "Architecture implementation & learning",
    status: "Learning repository · exploratory work",
    tags: ["PyTorch", "CNNs", "Transformers"],
    image: "/media/architecture.webp",
    caption:
      "Architecture reference reused from the original portfolio’s technical writing.",
    repo: "https://github.com/GitanshKothari/DeepReplication",
    quick:
      "DeepReplication is an implementation and learning repository, not a claim of new research. CNN and Transformer work is more developed; diffusion and later language-model components are exploratory. The emphasis is understanding architectural decisions through code. Comprehensive benchmarks and generated sample sets are not available.",
    body: [
      [
        "The project studies model families through implementation: convolutional networks, the Transformer, diffusion and later language-model components.",
        "The purpose is to make architecture descriptions concrete in code, not to claim state-of-the-art results.",
      ],
      [
        "I worked through architecture implementations and supporting training experiments. Scope differs by model family; an implementation should not be mistaken for a fully trained or benchmarked reproduction.",
      ],
      [
        "CNNs — feature extraction through convolutional model families. Transformer — attention and sequence modeling.",
        "Diffusion and later language-model components — exploratory implementations. These are not labeled as complete model reproductions.",
      ],
      [
        "Separating architecture implementation from training evidence makes the repository easier to evaluate honestly. Model-family coverage is a learning map, not a benchmark leaderboard.",
      ],
      [
        "CNN and Transformer sections are more complete than the advanced diffusion and language-model explorations. The documented Transformer experiment uses OPUS Books English-to-Italian translation.",
        "There is no comprehensive benchmark or sample suite establishing parity with the source papers.",
      ],
      [
        "Stable Diffusion and LLaMA2 work remains exploratory. No production readiness or new research result is claimed.",
        "The next useful step is a reproducible evaluation protocol for each implemented family, with explicit training configurations and reference comparisons.",
      ],
    ],
  },
];
export const experiences = [
  {
    id: "magna",
    company: "Magna International",
    role: "Software Engineering Intern",
    date: "May 2023 — June 2024",
    summary: "Making perception inference reliable on vehicle systems.",
    points: [
      "Improved the reliability of a C++ inference pipeline, including memory and multiprocessing issues.",
      "Worked with ONNX, TensorRT and CUDA deployment across four synchronized streams.",
      "Contributed to Dirty Lens Detection and FreeSpace perception work.",
    ],
    tags: "C++ · CUDA · TensorRT · ONNX",
  },
  {
    id: "mad-street-den",
    company: "Mad Street Den",
    role: "Machine Learning Intern",
    date: "June — August 2022",
    summary: "Learning from visual environments with reinforcement learning.",
    points: [
      "Implemented and evaluated PPO, DQN and A2C agents in ViZDoom.",
      "Worked on reward shaping and hyperparameter tuning across game scenarios.",
      "Built training and evaluation loops for visual decision-making.",
    ],
    tags: "Python · ViZDoom · OpenAI Gym · Stable Baselines",
  },
];
export const routes = [
  "/",
  ...nav.map((n) => n.href),
  ...projects.map((p) => "/projects/" + p.slug),
];
export function pageTitle(path: string) {
  return path === "/"
    ? "Gitansh Kothari"
    : nav.find((n) => n.href === path)?.title ||
        projects.find((p) => "/projects/" + p.slug === path)?.title ||
        "Page not found";
}
export const searchItems = [
  ...nav.map((n) => ({ ...n, type: "Page", description: n.aliases })),
  ...projects.map((p) => ({
    title: p.title,
    href: "/projects/" + p.slug,
    type: "Case study",
    aliases:
      p.tags.join(" ") +
      " " +
      p.summary +
      " " +
      (p.slug.includes("driving")
        ? "segmentation BDD100K Scalabel"
        : p.slug === "scholarspace-ai"
          ? "hints next.js classroom"
          : ""),
    description: p.summary,
  })),
  ...experiences.map((e) => ({
    title: e.company,
    href: "/experience#" + e.id,
    type: "Experience",
    aliases: e.tags + " " + e.role,
    description: e.summary,
  })),
  ...projects.flatMap((p) =>
    sections.map((s) => ({
      title: p.title + " · " + s,
      href: "/projects/" + p.slug + "#" + sectionId(s),
      type: "Section",
      aliases: s,
      description: p.title,
    })),
  ),
  {
    title: "Education",
    href: "/about#education",
    type: "About",
    aliases: "UCSD UC San Diego Toronto education",
    description: "Computer science & computer engineering",
  },
  {
    title: "View résumé",
    href: "/resume/Gitansh_Kothari_Resume.pdf",
    type: "PDF",
    aliases: "resume cv",
    description:
      "Source portfolio résumé · verify current version before release",
  },
  {
    title: "Copy email",
    href: "copy",
    type: "Action",
    aliases: "contact email copy",
    description: email,
  },
];

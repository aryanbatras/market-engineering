import { timelineStyles } from "./build-timeline.styles"

const steps = [
  {
    step: "Step one",
    title: "Type it, or paste it",
    body: "Identity, links, education, experience. The schema rejects anything it cannot render, while you type.",
    time: "0:00",
  },
  {
    step: "Step two",
    title: "Pick the shape",
    body: "Templates inherit the same tokens and lay out the same data differently. Switch later, nothing is lost.",
    time: "3:20",
  },
  {
    step: "Step three",
    title: "Publish one address",
    body: "One URL, a social card, a PDF, and a JSON export. Everything a recruiter opens comes from that page.",
    time: "8:40",
  },
]

const readouts = [
  { label: "Typical build", value: "9 min", fill: 12 },
  { label: "Lines of YAML to start", value: "34", fill: 34 },
  { label: "Templates", value: "Growing", fill: 48 },
  { label: "Cost to run", value: "Free", fill: 4 },
]

export const BuildTimeline = () => (
  <div className={timelineStyles.root}>
    <div className={timelineStyles.rail}>
      {steps.map((entry) => (
        <div className={timelineStyles.node} key={entry.step}>
          <div className={timelineStyles.markerRow}>
            <span className={timelineStyles.marker} />
          </div>
          <p className={timelineStyles.step}>{entry.step}</p>
          <p className={timelineStyles.title}>{entry.title}</p>
          <p className={timelineStyles.body}>{entry.body}</p>
          <p className={timelineStyles.time}>{entry.time}</p>
        </div>
      ))}
    </div>

    <div className={timelineStyles.readouts}>
      {readouts.map((entry) => (
        <div className={timelineStyles.readout} key={entry.label}>
          <p className={timelineStyles.readoutLabel}>{entry.label}</p>
          <p className={timelineStyles.readoutValue}>{entry.value}</p>
          <div className={timelineStyles.bar}>
            <div className={timelineStyles.barFill} style={{ width: `${entry.fill}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
)
interface CategoryIntroProps {
  intro: string;
  steps: string[];
}

export function CategoryIntro({ intro, steps }: CategoryIntroProps) {
  return (
    <section className="category-intro" aria-labelledby="intro-heading">
      <h2 id="intro-heading">Summary & what to do</h2>
      <p className="intro-text">{intro}</p>
      <h3 className="steps-heading">What to do right now</h3>
      <ul className="steps-list">
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ul>
    </section>
  );
}

/* Tweaks panel — directional options for the portfolio.
   Applies values to <body> data-attributes / CSS vars; the stylesheet does the rest. */
const PORTFOLIO_TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "cream",
  "accent": ["#ffd600", "#ff8f00"],
  "hero": "split",
  "grain": true
}/*EDITMODE-END*/;

function PortfolioTweaks() {
  const [t, setTweak] = useTweaks(PORTFOLIO_TWEAKS);

  React.useEffect(() => {
    const b = document.body;
    b.setAttribute('data-theme', t.theme);
    b.setAttribute('data-hero', t.hero);
    document.documentElement.style.setProperty('--grain', t.grain ? '1' : '0');
    const acc = Array.isArray(t.accent) ? t.accent : [t.accent, t.accent];
    b.style.setProperty('--accent', acc[0]);
    b.style.setProperty('--accent-deep', acc[1] || acc[0]);
  }, [t.theme, t.accent, t.hero, t.grain]);

  return (
    <TweaksPanel>
      <TweakSection label="Visual direction" />
      <TweakRadio
        label="Theme"
        value={t.theme}
        options={[
          { value: 'cream', label: 'Cream' },
          { value: 'gold', label: 'Gold' },
          { value: 'slate', label: 'Slate' }
        ]}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={[
          ['#ffd600', '#ff8f00'],
          ['#2d6a4f', '#1c4426'],
          ['#3f73c4', '#2f4a78'],
          ['#f0744f', '#d4502c']
        ]}
        onChange={(v) => setTweak('accent', v)}
      />
      <TweakSection label="Layout" />
      <TweakRadio
        label="Hero"
        value={t.hero}
        options={[
          { value: 'split', label: 'Split' },
          { value: 'stacked', label: 'Stacked' }
        ]}
        onChange={(v) => setTweak('hero', v)}
      />
      <TweakToggle label="Paper grain" value={t.grain} onChange={(v) => setTweak('grain', v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const root = document.getElementById('tweaks-root');
  if (root && window.ReactDOM && window.useTweaks) {
    ReactDOM.createRoot(root).render(<PortfolioTweaks />);
  }
})();

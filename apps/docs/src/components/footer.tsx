import { Brand } from './brand';
import { useT } from '../lib/i18n';
import { link } from '../lib/router';

/** Only the landing page carries this — a doc page ends on its own content. */
export const Footer = ({ github }: { github: string }) => {
  const t = useT();

  const item = 'text-muted-foreground transition-colors hover:text-foreground';

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-4 px-4 py-10 text-sm lg:px-6">
        <Brand />

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={link('/introduction')} className={item}>
            {t.home.footer.docs}
          </a>
          <a href={link('/components/button')} className={item}>
            {t.home.footer.components}
          </a>
          <a href={github} target="_blank" rel="noreferrer" className={item}>
            {t.home.footer.source}
          </a>
        </nav>

        <p className="ml-auto text-muted-foreground">{t.home.footer.licence}</p>
      </div>
    </footer>
  );
};

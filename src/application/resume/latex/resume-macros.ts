export const resumeMacros = String.raw`
\newcommand{\rnameleft}[2]{{\fontsize{#1}{#1}\selectfont\bfseries #2}\par}
\newcommand{\rnamecentred}[2]{\vspace{0.4ex}{\centering\fontsize{#1}{#1}\selectfont\bfseries #2\par}\vspace{0.2ex}}
\newcommand{\rnamebox}[2]{\vspace{1.2ex}\colorbox{resumeaccent}{\parbox{\dimexpr\linewidth-2\fboxsep\relax}{\color{white}\fontsize{#1}{#1}\selectfont\bfseries #2}}\par}
\newcommand{\rheadrule}[1]{\vspace{#1ex}\hrule height 0.4pt\relax\vspace{#1ex}}

\newcommand{\rnote}[1]{{\itshape #1}\par}
\newcommand{\rnotebold}[1]{{\bfseries #1}\par}
\newcommand{\rcontact}[1]{{#1}\par}
\newcommand{\rcaps}[1]{\MakeUppercase{#1}}
\newcommand{\rnocaps}[1]{#1}

\newcommand{\rsectionplain}[2]{\vspace{#1ex}{\bfseries #2}\par\nobreak\vspace{0.8ex}}

\newcommand{\rsectionrule}[2]{%
  \vspace{#1ex}%
  {\bfseries #2}\par\nobreak\vspace{0.6ex}%
  \hrule height 0.4pt\relax\nobreak\vspace{1.4ex}%
}

\newcommand{\rsectionbar}[2]{%
  \vspace{#1ex}%
  \colorbox{resumeaccent}{\parbox{\dimexpr\linewidth-2\fboxsep\relax}{\color{white}\bfseries #2}}%
  \vspace{1.2ex}%
}

\newcommand{\rsectioncaret}[2]{%
  \vspace{#1ex}%
  \noindent\hbox to 0pt{\rule{0.6ex}{0.6ex}\hskip0.9ex}%
  {\bfseries #2}\par\nobreak\vspace{0.8ex}%
}

\newcommand{\rsectionnorule}[2]{%
  \vspace{#1ex}%
  {\bfseries #2}\par\nobreak\vspace{0.8ex}%
}

\newcommand{\rentrysplit}[6]{%
  \par\noindent
  \makebox[\linewidth][l]{%
    {\bfseries #1}%
    \if\relax\detokenize{#2}\relax\else{\bfseries, #2}\fi%
    \hfill{\small #3}%
  }\par\nobreak
  \if\relax\detokenize{#4}\relax\else{\small #4}\par\nobreak\fi
  #5%
  \vspace{#6ex}%
}

\newcommand{\rentryinline}[6]{%
  \par\noindent
  {\bfseries #1}%
  \if\relax\detokenize{#2}\relax\else{\bfseries, #2}\fi%
  \if\relax\detokenize{#3}\relax\else{ \textbar\ {\small #3}}\fi%
  \par\nobreak
  \if\relax\detokenize{#4}\relax\else{\small #4}\par\nobreak\fi
  #5%
  \vspace{#6ex}%
}

\newcommand{\rtext}[1]{{\small #1}\par\nobreak}

\newcommand{\rbulletdot}[1]{\noindent\textbullet\enspace{\small #1}\par\nobreak}
\newcommand{\rbulletdash}[1]{\noindent\rule[0.42ex]{0.62em}{0.35pt}\enspace{\small #1}\par\nobreak}
\newcommand{\rbulletnone}[1]{\noindent{\small #1}\par\nobreak}

\newcommand{\rskills}[2]{\par\noindent\textbf{#1}\par\nobreak\vspace{#2ex}}

\newcommand{\rrailopen}[3]{%
  \par\noindent
  \begin{minipage}[t]{#1}#2\end{minipage}\hfill%
  \begin{minipage}[t]{#3}%
}
\newcommand{\rrailclose}{\end{minipage}\par}

\newcommand{\rrailtint}[1]{%
  \colorbox{resumeaccent!10}{\parbox{\dimexpr\linewidth-2\fboxsep\relax}{\vspace{0.8ex}#1\vspace{0.8ex}}}%
}

\newcommand{\rdocsetup}{%
  \setlength{\parindent}{0pt}%
  \setlength{\parskip}{0pt}%
  \raggedright%
  \pagestyle{empty}%
}
`
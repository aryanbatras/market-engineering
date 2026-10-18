export const resumeMacros = String.raw`
\newcommand{\rname}[1]{{\fontsize{21}{24}\selectfont\bfseries #1}\par}
\newcommand{\rnote}[1]{{\itshape #1}\par}
\newcommand{\rcontact}[1]{{#1}\par}

\newcommand{\rsection}[1]{%
  \vspace{2.6ex}%
  {\bfseries #1}\par\nobreak\vspace{0.8ex}%
}

\newcommand{\rsectionrule}[1]{%
  \vspace{2.6ex}%
  {\bfseries #1}\par\nobreak\vspace{0.6ex}%
  \hrule height 0.4pt\relax\nobreak\vspace{1.4ex}%
}

\newcommand{\rentry}[5]{%
  \par\noindent
  \makebox[\linewidth][l]{%
    {\bfseries #1}%
    \if\relax\detokenize{#2}\relax\else{\bfseries, #2}\fi%
    \hfill{\small #3}%
  }\par\nobreak
  \if\relax\detokenize{#4}\relax\else{\small #4}\par\nobreak\fi
  #5%
  \vspace{1.2ex}%
}

\newcommand{\rtext}[1]{{\small #1}\par\nobreak}
\newcommand{\rbullet}[1]{\noindent\textbullet\enspace{\small #1}\par\nobreak}

\newcommand{\rskills}[1]{%
  \par\noindent\textbf{#1}\par\nobreak\vspace{1.2ex}%
}

\newcommand{\rdocsetup}{%
  \setlength{\parindent}{0pt}%
  \setlength{\parskip}{0pt}%
  \raggedright%
  \pagestyle{empty}%
}
`
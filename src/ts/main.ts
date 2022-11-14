const HEADER = "[danbooru-to-prompt]";

const toTagList = (value: string): string => {
  return `<ul class="tag-list">${value}</ul>`;
};

const toList = (value: string, style: string | null = null): string => {
  if (style == null)
    return `<li data-tag-name="${value}"><span title="9999999">${value}</span></li>`;
  else
    return `<li data-tag-name="${value}"><span class="${style}" title="9999999">${value}</span></li>`;
};

const toHeading = (value: string, style: string | null = null): string => {
  if (style == null) return `<h3>${value}</h3>`;
  else return `<h3 class="${style}">${value}</h3>`;
};

const toDiv = (value: string, style: string | null = null): string => {
  if (style == null) return `<div>${value}</div>`;
  else return `<div class="${style}">${value}</div>`;
};

const toButton = (value: string, id: string | null = null): string => {
  if (id == null) return `<button>${value}</button>`;
  else return `<button id="${id}">${value}</button>`;
};

const toParagraph = (value: string, id: string | null = null): string => {
  if (id == null) return `<p>${value}</p>`;
  else return `<p id="${id}">${value}</p>`;
};

const toSpan = (
  value: string,
  id: string | null = null,
  attr: string = "id"
): string => {
  if (id == null) return `<span>${value}</span>`;
  else return `<span ${attr}="${id}">${value}</span>`;
};

window.addEventListener("load", (e) => {
  const tagListQuery = "div.tag-list.categorized-tag-list";
  const checkedQuery = 'input[type="checkbox"]:checked';
  const checkboxQuery = 'input[type="checkbox"]';
  const tagQuery = "li.tag-type-0";
  const InsertElement = toDiv(
    '<input type="checkbox">' +
      '<svg class="icon svg-icon emphasis-up-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M272 480h-96c-13.3 0-24-10.7-24-24V256H48.2c-21.4 0-32.1-25.8-17-41L207 39c9.4-9.4 24.6-9.4 34 0l175.8 176c15.1 15.1 4.4 41-17 41H296v200c0 13.3-10.7 24-24 24z"></path></svg>' +
      toSpan("1.0", "data-tag-emphasis", "class") +
      '<svg class="icon svg-icon emphasis-down-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M176 32h96c13.3 0 24 10.7 24 24v200h103.8c21.4 0 32.1 25.8 17 41L241 473c-9.4 9.4-24.6 9.4-34 0L31.3 297c-15.1-15.1-4.4-41 17-41H152V56c0-13.3 10.7-24 24-24z"></path></svg>',
    "d2p-option"
  );

  const heading: Element | null = document.querySelector(tagListQuery);
  if (heading == null) return;

  heading.insertAdjacentHTML(
    "afterbegin",
    toTagList(
      [
        toList("masterpiece", "d2p-tag"),
        toList("best quality", "d2p-tag"),
      ].join("")
    )
  );

  heading.insertAdjacentHTML(
    "afterbegin",
    toHeading("Quality Tag", "quality-tag-list")
  );

  heading.insertAdjacentHTML(
    "afterbegin",
    toTagList(
      [
        toButton("auto select", "d2p-auto-select"),
        toButton("copy to clipboard", "d2p-copy"),
        toParagraph(
          [
            toSpan("token size: "),
            toSpan("0", "d2p-token-size"),
            toSpan("/75"),
          ].join("")
        ),
      ].join("")
    )
  );

  heading.insertAdjacentHTML(
    "afterbegin",
    toHeading("Danbooru To Prompt", "danbooru-to-prompt")
  );

  const listItemQuery = "ul>li";
  const emphasisUpQuery = ".emphasis-up-icon";
  const emphasisDownQuery = ".emphasis-down-icon";
  const emphasisSpanQuery = "span.data-tag-emphasis";
  heading.querySelectorAll(listItemQuery).forEach((li) => {
    li.insertAdjacentHTML("afterbegin", InsertElement);
  });
  heading.querySelectorAll(emphasisUpQuery).forEach((icon) => {
    icon.addEventListener("click", (e) => {
      let emphasis = icon.parentElement?.querySelector(emphasisSpanQuery);
      if (emphasis === undefined) return;
      if (emphasis === null) return;
      if (parseFloat(emphasis.innerHTML) >= 1.7) return;
      emphasis.innerHTML = (parseFloat(emphasis.innerHTML) + 0.1).toFixed(1);
    });
  });
  heading.querySelectorAll(emphasisDownQuery).forEach((icon) => {
    icon.addEventListener("click", (e) => {
      let emphasis = icon.parentElement?.querySelector(emphasisSpanQuery);
      if (emphasis === undefined) return;
      if (emphasis === null) return;
      if (parseFloat(emphasis.innerHTML) <= 0.1) return;
      emphasis.innerHTML = (parseFloat(emphasis.innerHTML) - 0.1).toFixed(1);
    });
  });

  const getChecked = (): string[] => {
    return sort(
      <Element[]>(
        [...heading.querySelectorAll(checkedQuery)]
          .map((input) => input?.parentElement?.parentElement)
          .filter((value) => value !== null)
      )
    ).map((value) =>
      emphasis(
        escape(value.getAttribute("data-tag-name")!),
        parseFloat(value.querySelector(emphasisSpanQuery)?.innerHTML ?? "1.0")
      )
    );
  };

  const emphasis = (word: string, factor: number): string => {
    if (factor == 1) return word;
    if (factor == 1.1) return "(" + word + ")";
    return "(" + word + ":" + factor.toFixed(1) + ")";
  };

  const escape = (word: string): string => {
    return word
      .replace("(", "\\(")
      .replace(")", "\\)")
      .replace("[", "\\[")
      .replace("]", "\\]");
  };

  const sort = (value: Element[]): Element[] => {
    return value.sort((a: Element, b: Element) => {
      const titleA: Number = Number(
        a.querySelector("span[title]")?.getAttribute("title")
      );
      const titleB: Number = Number(
        b.querySelector("span[title]")?.getAttribute("title")
      );
      if (titleA > titleB) return -1;
      else if (titleA < titleB) return 1;
      else return 0;
    });
  };

  const clacTokenSize = (value: string): number => {
    const re = new RegExp("([0-9０-９]{1,4}|[a-zA-Z]{1,4})", "g");

    return value.match(re)?.length ?? 0;
  };
  const getTokenSize = (): number => {
    return getChecked()
      .map((value) => Number(clacTokenSize(value)))
      .reduce((sum, element) => sum + element, 0);
  };

  const changeTokenSize = () => {
    const text: string | undefined = getTokenSize().toString();
    const tokenSize: Element | null = document.getElementById("d2p-token-size");
    if (text === undefined) text == "error";
    if (tokenSize === null) return;
    tokenSize.innerHTML = text;
  };

  heading.querySelectorAll(checkboxQuery).forEach((e) => {
    e.addEventListener("change", (_) => changeTokenSize());
  });

  document
    .getElementById("d2p-auto-select")
    ?.addEventListener("click", (button: MouseEvent) => {
      const tagList = [...heading.querySelectorAll(tagQuery)]
        .filter((tag) => tag.getAttribute("data-tag-name") !== null)
        .filter((tag) => tag.querySelector(checkboxQuery) !== null);

      tagList.forEach((value) => {
        (value.querySelector(checkboxQuery) as HTMLInputElement).checked =
          false;
      });
      let length = getTokenSize();
      sort(tagList).forEach((value: Element) => {
        const input: string | null = value.getAttribute("data-tag-name");
        if (input == null) return;
        if (length + clacTokenSize(input) > 75) return;
        (value.querySelector(checkboxQuery) as HTMLInputElement).checked = true;
        length += clacTokenSize(input);
      });
      changeTokenSize();
    });

  document
    .getElementById("d2p-copy")
    ?.addEventListener("click", (button: MouseEvent) => {
      const output = getChecked().join(" ");
      console.log(`${HEADER}\n${output}`);
      return navigator.clipboard
        .writeText(output)
        .then(
          () => {
            console.log(`${HEADER} success`);
            (button.target as Element).innerHTML = "success";
          },
          () => {
            console.log(`${HEADER} failed`);
            (button.target as Element).innerHTML = "failed";
          }
        )
        .then(() =>
          setTimeout(
            () => ((button.target as Element).innerHTML = "copy to clipboard"),
            2000
          )
        );
    });
});

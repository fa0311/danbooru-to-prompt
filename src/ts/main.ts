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

const toButton = (value: string, id: string | null = null): string => {
  if (id == null) return `<button>${value}</button>`;
  else return `<button id="${id}">${value}</button>`;
};

const toParagraph = (value: string, id: string | null = null): string => {
  if (id == null) return `<p>${value}</p>`;
  else return `<p id="${id}">${value}</p>`;
};

const toSpan = (value: string, id: string | null = null): string => {
  if (id == null) return `<span>${value}</span>`;
  else return `<span id="${id}">${value}</span>`;
};

window.addEventListener("load", (e) => {
  const tagListQuery = "div.tag-list.categorized-tag-list";
  const checkedQuery = 'input[type="checkbox"]:checked';
  const checkboxQuery = 'input[type="checkbox"]';
  const tagQuery = "li.tag-type-0";

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
  heading.querySelectorAll(listItemQuery).forEach((li) => {
    li.insertAdjacentHTML("afterbegin", '<input type="checkbox">');
  });

  const getChecked = (): string[] => {
    return sort(
      [...heading.querySelectorAll(checkedQuery)]
        .filter((input) => input.parentElement !== null)
        .filter(
          (input) => input.parentElement!.getAttribute("data-tag-name") !== null
        )
        .map((value) => value.parentElement!)
    ).map((value) => value.getAttribute("data-tag-name")!);
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

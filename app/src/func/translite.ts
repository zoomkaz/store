export const translit = (word: string, reverse?: boolean) => {
  let
    rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
    eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
    ;
  let x;
  for (x = 0; x < rus.length; x++) {
    word = word.split(reverse ? eng[x] : rus[x]).join(reverse ? rus[x] : eng[x]);
    word = word.split(reverse ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(reverse ? rus[x].toUpperCase() : eng[x].toUpperCase());
  }
  return reverse ? word.replaceAll('-', ' ') : word.replaceAll(' ', '-');
}
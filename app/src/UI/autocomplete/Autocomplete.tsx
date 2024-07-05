import React from 'react'
import styles from './Autocomplete.module.scss'

interface AutocompletePropsType {
  searchValue: string;
  searchList: string[];
  setValue: (param: string) => void;
  setSearchValue: (param: string) => void;
  tag: string;
  setShowModal: (param: boolean) => void;
}

const Autocomplete = ({
  searchValue,
  searchList,
  setValue,
  setSearchValue,
  tag,
  setShowModal
}: AutocompletePropsType) => {

  const complete = (el: string) => {
    setValue(el)
    tag === 'city' ? localStorage.setItem("city", el) : <></>;
    setSearchValue('')
    setShowModal(false)
  }

  return (
    <div className={styles.autocomplete}>
      {
        searchList.filter(el => el.toLowerCase().startsWith(searchValue.toLowerCase())).length ?
          searchList.filter(el => el.toLowerCase().startsWith(searchValue.toLowerCase())).slice(0, 5)
            .map((el, index) => <p key={index} className={styles.item} onClick={() => complete(el)}>
              <span className={styles.searchString}>
                {`${searchValue[0].toUpperCase()}${searchValue.slice(1)}`}
              </span>
              {el.toLowerCase().replace(searchValue.toLowerCase(), '')}
            </p>)
          : <p className={styles.item}>Не найдено</p>
      }
    </div>
  )
}

export default Autocomplete
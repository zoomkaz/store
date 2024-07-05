import React, { useEffect, useState } from 'react'
import styles from './Filter.module.scss'
import FilterItem from './filterItem/FilterItem';
import { IBrand, IProduct } from '../../types/types';
import { GetAllProductsFilterMethod } from '../../services/ProductService';
import { useDebouncedCallback } from 'use-debounce';

interface FilterPropsType {
  filters: string[]
  items: IProduct[]
  filteredItems: IProduct[]
  setItems: (param: IProduct[]) => void
  setFilteredItems: (param: IProduct[]) => void
  setItemLoading: (param: boolean) => void;
}

const Filter = ({ filters, items, setItems, filteredItems, setFilteredItems, setItemLoading }: FilterPropsType) => {
  const [value, setValue] = React.useState<number[]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000)
  const [valueWeight, setValueWeight] = React.useState<number[]>([0, 1000]);
  const [maxWeight, setMaxWeight] = useState(1000)
  const [allBrands, setAllBrands] = useState<string[]>(['brand1', 'brand2'])
  const [allFullBrands, setAllFullBrands] = useState<IBrand[]>([])
  const [allAges, setAllAges] = useState<string[]>(['3', '4', '5', '21'])
  const [allColors, setAllColors] = useState<string[]>(['белый'])
  const [categoryId, setCategoryId] = useState(0)

  useEffect(() => {
    let maxP = 0;
    let maxW = 0;
    let tempBrands: string[] = [];
    let tempFullBrands: IBrand[] = [];
    let tempAges: string[] = [];
    let tempColors: string[] = [];
    items.forEach(el => {
      let propWeight = el.props.filter(pr => pr.name === 'weight')
      let propAge = el.props.filter(pr => pr.name === 'age')
      if (tempBrands.indexOf(el.brand.name.toString()) === -1) {
        tempBrands.push(el.brand.name.toString());
        tempFullBrands.push(el.brand)
      }
      if (tempColors.indexOf(el.props.filter(pr => pr.name === 'color')[0].value) === -1) {
        let propColor = el.props.filter(pr => pr.name === 'color')
        propColor.length && tempColors.push(propColor[0].value)
      }
      if (propAge.length && propAge[0].value) {
        if (propAge[0].value.split('-')[1]) {
          for (let i = +propAge[0].value.split('-')[0]; i <= +propAge[0].value.split('-')[1]; i++) {
            if (tempAges.indexOf(i.toString()) === -1) {
              tempAges.push(i.toString())
            }
          }
        } else {
          if (tempAges.indexOf(propAge[0].value) === -1) {
            for (let i = 2; i <= +propAge[0].value; i++) {
              if (tempAges.indexOf(i.toString()) === -1) {
                tempAges.push(i.toString())
              }
            }
          }
        }
      }
      if (+el.price > maxP) {
        maxP = +el.price
      }
      if (propWeight.length && +propWeight[0].value > maxW) {
        maxW = +propWeight[0].value
      }
    })
    setMaxPrice(maxP);
    setValue([0, maxP])
    setMaxWeight(maxW);
    setValueWeight([0, maxW])
    setAllBrands(tempBrands);
    setAllFullBrands(tempFullBrands);
    setActiveBrands(tempBrands);
    tempAges.sort((a, b) => +a - +b)
    setAllAges(tempAges);
    setActiveAges(tempAges);
    setAllColors(tempColors);
    setActiveColors(tempColors);
    if (items.length) {
      setCategoryId(items[0].categoryId)
    }
  }, [items])

  const [activeBrands, setActiveBrands] = useState<string[]>(allBrands)
  const [activeColors, setActiveColors] = useState<string[]>(allColors)
  const [activeAges, setActiveAges] = useState<string[]>(allAges)
  const [activeStop, setActiveStop] = useState<boolean>(false)

  const filter = useDebouncedCallback(async () => {
    const brandIds: string[] = []
    for (let i = 0; i < activeBrands.length; i++) {
      for (let j = 0; j < allFullBrands.length; j++) {
        if (activeBrands[i] === allFullBrands[j].name) {
          brandIds.push(allFullBrands[j].id.toString())
        }
      }
    }
    const data = await GetAllProductsFilterMethod(
      categoryId,
      brandIds.length ? brandIds.join(',') : allFullBrands.map(el => el.id).join(','),
      activeColors.length ? activeColors.join(',') : allColors.join(','),
      valueWeight.join(','),
      value.join(','),
      activeAges.length ? activeAges.join(',') : allAges.join(','),
      activeStop,
    )
    if (data.status === 200) {
      setFilteredItems(data.data.rows)
      setItemLoading(false)
    }
  },
    500
  )
  useEffect(() => {
    setItemLoading(true)
    filter()
  }, [
    activeAges,
    activeBrands,
    activeColors,
    allAges,
    allColors,
    allFullBrands,
    categoryId,
    filter,
    setFilteredItems,
    setItemLoading,
    valueWeight,
    value,
    activeStop,
  ])

  return (
    <div className={styles.filter}>
      {
        filters.map((el, index) => {
          return <div className={styles.filterItemContainer} key={index}>
            <FilterItem
              filterName={el}
              value={value}
              setValue={setValue}
              maxPrice={maxPrice}
              valueWeight={valueWeight}
              setValueWeight={setValueWeight}
              maxWeight={maxWeight}
              allBrands={allBrands}
              setAllBrands={setAllBrands}
              allAges={allAges}
              setAllAges={setAllAges}
              allColors={allColors}
              setAllColors={setAllColors}
              activeBrands={activeBrands}
              setActiveBrands={setActiveBrands}
              activeAges={activeAges}
              setActiveAges={setActiveAges}
              activeColors={activeColors}
              setActiveColors={setActiveColors}
              activeStop={activeStop}
              setActiveStop={setActiveStop}
            />
          </div>
        })
      }
    </div>
  )
}

export default Filter
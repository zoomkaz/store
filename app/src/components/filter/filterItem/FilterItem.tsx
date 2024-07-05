import React, { useEffect, useState } from 'react'
import styles from './FilterItem.module.scss'
import arrow from '../../../assets/icons/arrowDownMini.svg'
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { sklonenie } from '../../../func/sklonenie';

interface FIlterItemPropsType {
  filterName: string
  value: number[]
  setValue: (param: number[]) => void
  maxPrice: number;
  valueWeight: number[]
  setValueWeight: (param: number[]) => void
  maxWeight: number;
  allBrands: string[];
  setAllBrands: (param: string[]) => void;
  allAges: string[];
  setAllAges: (param: string[]) => void;
  allColors: string[];
  setAllColors: (param: string[]) => void;
  activeBrands: string[];
  setActiveBrands: (param: string[]) => void;
  activeAges: string[];
  setActiveAges: (param: string[]) => void;
  activeColors: string[];
  setActiveColors: (param: string[]) => void;
  activeStop: boolean;
  setActiveStop: (param: boolean) => void;
}

const FilterItem = ({
  filterName,
  value,
  setValue,
  maxPrice,
  valueWeight,
  setValueWeight,
  maxWeight,
  allBrands,
  setAllBrands,
  allAges,
  setAllAges,
  allColors,
  setAllColors,
  activeBrands,
  setActiveBrands,
  activeAges,
  setActiveAges,
  activeColors,
  setActiveColors,
  activeStop,
  setActiveStop,
}: FIlterItemPropsType) => {

  const filters = {
    price: "Цена",
    brand: "Бренд",
    age: "Возраст",
    color: 'Цвет',
    weight: 'Вес',
    stop: 'В наличии'
  }

  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)

  const openFilter = () => {
    const currentFilter = document.getElementById(`hb-${filterName}`) ?? document.createElement("div");
    setHeight(currentFilter.scrollHeight + 10)
    setOpen(!open)
  }

  useEffect(() => {
    // openFilter()
    const currentFilter = document.getElementById(`hb-${filterName}`) ?? document.createElement("div");
    if (filterName === 'brand' || filterName === 'color' || filterName === 'age') {
      setTimeout(() => {
        setHeight(currentFilter.scrollHeight + 10)
        setOpen(!open)
      }, 1000);
    } else {
      setHeight(currentFilter.scrollHeight + 10)
      setOpen(!open)
    }
  }, [])

  // SLIDER PRICE RANGE SLIDER PRICE RANGE SLIDER PRICE RANGE SLIDER PRICE RANGE SLIDER PRICE RANGE

  const valuetext = (value: number) => {
    return `${value}°C`;
  }

  const minDistance = 100;

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isInteger(+event.target.value)) return
    setValue([event.target.value === '' ? 0 : Number(event.target.value), value[1]]);
  };
  const handleInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isInteger(+event.target.value)) return
    setValue([value[0], event.target.value === '' ? 0 : Number(event.target.value)]);
  };

  // SLIDER PRICE RANGE SLIDER PRICE RANGE SLIDER PRICE RANGE SLIDER PRICE RANGE SLIDER PRICE RANGE

  // SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE

  const valueWeightText = (value: number) => {
    return `${value}°C`;
  }

  const minWeightDistance = 0.1;

  const handleWeightChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValueWeight([Math.min(newValue[0], valueWeight[1] - minWeightDistance), valueWeight[1]]);
    } else {
      setValueWeight([valueWeight[0], Math.max(newValue[1], valueWeight[0] + minWeightDistance)]);
    }
  };

  const handleInput1WeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isInteger(+event.target.value)) return
    setValueWeight([event.target.value === '' ? 0 : Number(event.target.value), valueWeight[1]]);
  };
  const handleInput2WeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isInteger(+event.target.value)) return
    setValueWeight([valueWeight[0], event.target.value === '' ? 0 : Number(event.target.value)]);
  };

  // SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE SLIDER WEIGHT RANGE

  // BRAND CHECKBOX BRAND CHECKBOX BRAND CHECKBOX BRAND CHECKBOX BRAND CHECKBOX

  const [checkedBrands, setCheckedBrands] = useState<string[]>([])

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (!e.target.labels) return
      setCheckedBrands([...checkedBrands, e.target.labels[0].innerText])
    } else {
      let temp = checkedBrands.filter(el => el !== (e.target.labels ? e.target.labels[0].innerText : ''))
      setCheckedBrands(temp)
    }
  }

  useEffect(() => {
    setActiveBrands(checkedBrands)
  }, [checkedBrands, setActiveBrands])

  // BRAND CHECKBOX BRAND CHECKBOX BRAND CHECKBOX BRAND CHECKBOX BRAND CHECKBOX

  // STOP CHECKBOX STOP CHECKBOX STOP CHECKBOX STOP CHECKBOX STOP CHECKBOX

  const [checkedStop, setCheckedStop] = useState<boolean>(false)

  const handleStopChange = () => {
    setCheckedStop(!checkedStop)
    setActiveStop(!checkedStop)
  }

  useEffect(() => {
    console.log(activeStop);

  }, [activeStop])

  // STOP CHECKBOX STOP CHECKBOX STOP CHECKBOX STOP CHECKBOX STOP CHECKBOX

  // COLOR CHECKBOX COLOR CHECKBOX COLOR CHECKBOX COLOR CHECKBOX COLOR CHECKBOX

  const colors = {
    'white': 'белый',
    'yellow': 'желтый',
    'green': 'зеленый',
    'orange': 'оранжевый',
    'cyan': 'голубой',
    'pink': 'розовый',
    'purple': 'пурпурный',
    'transparent': 'прозрачный',
    'blue': 'синий',
    'violet': 'фиолетовый',
    'turquoise': 'бирюзовый',
    'red': 'красный',
    'brown': 'коричневый',
    'aqua': 'морская волна'
  }

  const colorTranslate = (color: string, language: 'en' | 'ru') => {
    if (language === 'ru') {
      for (const col in colors) {
        if (color === colors[col as keyof typeof colors]) {
          return col
        }
      }
    } else {
      for (const col in colors) {
        if (color === col) {
          return colors[col as keyof typeof colors]
        }
      }
    }
  }

  const [checkedColors, setCheckedColors] = useState<string[]>([])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (!e.target.labels) return
      setCheckedColors([...checkedColors, colorTranslate(e.target.labels[0].innerText, 'ru') ?? ''])
    } else {
      let temp = checkedColors.filter(el => el !== (e.target.labels ? colorTranslate(e.target.labels[0].innerText, 'ru') ?? '' : ''))
      setCheckedColors(temp)
    }
  }

  useEffect(() => {
    setActiveColors(checkedColors)
  }, [checkedColors, setActiveColors])

  // COLOR CHECKBOX COLOR CHECKBOX COLOR CHECKBOX COLOR CHECKBOX COLOR CHECKBOX

  // AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX

  const ageVariants = ['год', 'года', 'лет']

  const [checkedAges, setCheckedAges] = useState<string[]>([])

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (!e.target.labels) return
      setCheckedAges([...checkedAges, e.target.labels[0].innerText.split(' ')[0]])
    } else {
      let temp = checkedAges.filter(el => el !== (e.target.labels ? e.target.labels[0].innerText.split(' ')[0] : ''))
      setCheckedAges(temp)
    }
  }

  useEffect(() => {
    setActiveAges(checkedAges)
  }, [checkedAges, setActiveAges])

  // AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX AGE CHECKBOX

  return (
    <div className={styles.filterItem}>
      <div className={styles.close} onClick={openFilter}>
        <p className={styles.name}>{filters[filterName as keyof typeof filters]}</p>
        <img src={arrow} alt="arrow" className={open ? styles.rotate : ''} />
      </div>
      <div className={styles.open}
        style={open ? { height: `${height}px`, paddingTop: '10px' } : { height: '0px', paddingTop: '0px' }}
      >
        <div id={`hb-${filterName}`}>
          {
            filterName === 'price' ?
              <div className={styles.priceBox}>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder={value[0].toString()}
                    value={value[0]}
                    className={styles.inp1}
                    onChange={(e) => handleInput1Change(e)}
                  />
                  <input
                    type="text"
                    placeholder={value[1].toString()}
                    value={value[1]}
                    className={styles.inp2}
                    onChange={(e) => handleInput2Change(e)}
                  />
                </div>
                <Slider
                  getAriaLabel={() => 'Minimum distance'}
                  value={value}
                  onChange={handleChange}
                  getAriaValueText={valuetext}
                  disableSwap
                  max={maxPrice}
                  min={0}
                  sx={{
                    color: '#ffc85e',
                    '& .MuiSlider-thumb:hover': {
                      boxShadow: '0 0 0px 10px #ffc85e50',
                    },
                    '& .MuiSlider-thumb:focus': {
                      boxShadow: '0 0 0px 10px #ffc85e50',
                    },
                    '& .MuiSlider-thumb.Mui-active': {
                      boxShadow: '0 0 0px 10px #ffc85e50',
                    },
                  }}
                />
              </div>
              : filterName === 'weight' ?
                <div className={styles.priceBox}>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      placeholder={valueWeight[0].toString()}
                      value={valueWeight[0]}
                      className={styles.inp1}
                      onChange={(e) => handleInput1WeightChange(e)}
                    />
                    <input
                      type="text"
                      placeholder={valueWeight[1].toString()}
                      value={valueWeight[1]}
                      className={styles.inp2}
                      onChange={(e) => handleInput2WeightChange(e)}
                    />
                  </div>
                  <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={valueWeight}
                    onChange={handleWeightChange}
                    getAriaValueText={valueWeightText}
                    disableSwap
                    max={maxWeight}
                    min={0}
                    step={0.1}
                    sx={{
                      color: '#ffc85e',
                      '& .MuiSlider-thumb:hover': {
                        boxShadow: '0 0 0px 10px #ffc85e50',
                      },
                      '& .MuiSlider-thumb:focus': {
                        boxShadow: '0 0 0px 10px #ffc85e50',
                      },
                      '& .MuiSlider-thumb.Mui-active': {
                        boxShadow: '0 0 0px 10px #ffc85e50',
                      },
                    }}
                  />
                </div>
                : filterName === 'brand' ?
                  <div className={styles.brandBox}>
                    <FormGroup>
                      {
                        allBrands.map((el, index) => {
                          return <FormControlLabel key={index} control={
                            <Checkbox
                              onChange={(e) => handleBrandChange(e)}
                              sx={{
                                color: 'orange',
                                '&.Mui-checked': {
                                  color: 'orange',
                                },
                                '&.Mui-hover': {
                                  color: 'orange',
                                },
                              }}
                            />
                          } label={el} />
                        })
                      }
                    </FormGroup>
                  </div>
                  : filterName === 'stop' ?
                    <div className={styles.brandBox}>
                      <FormGroup>
                        <FormControlLabel control={
                          <Checkbox
                            onChange={handleStopChange}
                            sx={{
                              color: 'orange',
                              '&.Mui-checked': {
                                color: 'orange',
                              },
                              '&.Mui-hover': {
                                color: 'orange',
                              },
                            }}
                          />
                        } label={'Только доступные товары'} />
                      </FormGroup>
                    </div>
                    : filterName === 'color' ?
                      <div className={styles.colorBox}>
                        <FormGroup>
                          {
                            allColors.map((el, index) => {
                              return <FormControlLabel key={index} control={
                                <Checkbox
                                  onChange={(e) => handleColorChange(e)}
                                  sx={{
                                    color: el === 'white' ? 'grey' : el === 'transparent' ? 'grey' : el,
                                    '&.Mui-checked': {
                                      color: el === 'white' ? 'grey' : el === 'transparent' ? 'grey' : el,
                                    },
                                    '&.Mui-hover': {
                                      color: el === 'white' ? 'grey' : el === 'transparent' ? 'grey' : el,
                                    },
                                  }}
                                />
                              } label={colors[el as keyof typeof colors]} />
                            })
                          }
                        </FormGroup>
                      </div>
                      : filterName === 'age' ?
                        <div className={styles.ageBox}>
                          <FormGroup>
                            {
                              allAges.map((el, index) => {
                                return <FormControlLabel key={index} control={
                                  <Checkbox
                                    onChange={(e) => handleAgeChange(e)}
                                    sx={{
                                      color: 'orange',
                                      '&.Mui-checked': {
                                        color: 'orange',
                                      },
                                      '&.Mui-hover': {
                                        color: 'orange',
                                      },
                                    }}
                                  />
                                } label={`${el} ${sklonenie(+el, ageVariants)}`} />
                              })
                            }
                          </FormGroup>
                        </div>
                        :
                        <div>
                          <p>OPEN</p>
                          <p>OPEN</p>
                          <p>OPEN</p>
                          <p>OPEN</p>
                        </div>
          }
        </div>
      </div>
    </div>
  )
}

export default FilterItem
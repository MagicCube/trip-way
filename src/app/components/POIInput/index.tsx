import { Select } from 'antd';
import type { LabeledValue } from 'antd/lib/select';
import { memo, useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import { POIService } from '@/core/geo';
import type { DetailedPOI } from '@/core/types';

import styles from './index.module.less';

export interface POIInputProps {
  className?: string;
  placeholder?: string;
  value?: DetailedPOI | null;
  disabled?: boolean;
  onChange?: (selection: DetailedPOI) => void;
}

export const POIInput = memo(
  ({ className, placeholder, value, disabled, onChange }: POIInputProps) => {
    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword] = useDebounce(keyword, 200);
    const [searchResults, setSearchResults] = useState<DetailedPOI[]>([]);
    const [options, setOptions] = useState<LabeledValue[]>([]);

    useEffect(() => {
      if (debouncedKeyword) {
        const newKeyword = debouncedKeyword;
        POIService.autocomplete(newKeyword)
          .then((result) => {
            if (debouncedKeyword === newKeyword) {
              setSearchResults(result);
              setOptions(
                result.map((poi) => ({
                  label: <POILabel poi={poi} />,
                  value: poi.id,
                })),
              );
            }
          })
          .catch(() => {
            setSearchResults([]);
            setOptions([]);
          });
      } else {
        setSearchResults([]);
        setOptions([]);
      }
    }, [debouncedKeyword]);

    const handleSearch = useCallback((newKeyword: string) => {
      setKeyword(newKeyword);
    }, []);
    const handleChange = useCallback(
      (value: string, labeledValue: LabeledValue) => {
        const selection = searchResults.find(
          (poi) => poi.id === labeledValue.value,
        );
        if (selection && onChange) {
          onChange(selection);
        }
      },
      [onChange, searchResults],
    );
    return (
      <Select<LabeledValue>
        className={className}
        placeholder={placeholder || '地名，景点，住宿，餐饮，购物'}
        value={
          value ? { label: <POILabel poi={value} />, value: value.id } : null
        }
        disabled={disabled}
        size="large"
        showSearch
        showArrow={false}
        filterOption={false}
        notFoundContent={null}
        options={options}
        //@ts-ignore
        onChange={handleChange}
        onSearch={handleSearch}
      />
    );
  },
);
POIInput.displayName = 'POIInput';

const POILabel = memo(({ poi }: { poi: DetailedPOI }) => {
  return (
    <div className={styles.optionContent}>
      <div className={styles.optionName}>{poi.name}</div>
      <div className={styles.optionDesc}>{poi.cityname}</div>
    </div>
  );
});
POILabel.displayName = 'POILabel';

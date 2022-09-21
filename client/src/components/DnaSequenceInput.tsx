import { FC } from 'react';

export const DnaSequenceInput: FC<{isLoading: boolean}> = ({isLoading}) => (
        <input type="text" name="sequence" placeholder="DNA string*(ACTG)" required className="inp" disabled={isLoading} pattern="^[ACTG]{1,255}$" />
)


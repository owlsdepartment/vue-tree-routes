export type OverrideProps<M, N> = {
    [P in keyof M]: P extends keyof N ? N[P] : M[P]
};

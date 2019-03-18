import { css } from "azure-devops-ui/Util";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IMultiValuePickerProps, MultiValuePicker } from "Common/Components/Pickers/MultiValuePicker";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { areTagsLoading, getTagModule, getTags, ITagAwareState, TagActions } from "../Redux";

interface IWorkItemTagPickerStateProps {
    tags?: string[];
    loading: boolean;
}

function mapStateToProps(state: ITagAwareState): IWorkItemTagPickerStateProps {
    return {
        tags: getTags(state),
        loading: areTagsLoading(state)
    };
}

const Actions = { loadTags: TagActions.loadRequested };

function WorkItemTagPickerInternal(props: IMultiValuePickerProps) {
    const { tags, loading } = useMappedState(mapStateToProps);
    const { loadTags } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!tags && !loading) {
            loadTags();
        }
    }, []);

    const newProps = {
        ...props,
        className: css("work-item-tags-picker", props.className),
        allValues: tags || []
    } as IMultiValuePickerProps;

    return <MultiValuePicker {...newProps} />;
}

export function WorkItemTagPicker(props: IMultiValuePickerProps) {
    return (
        <DynamicModuleLoader modules={[getTagModule()]}>
            <WorkItemTagPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
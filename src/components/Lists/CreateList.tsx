import { useState, FormEvent } from 'react';
import { createList } from '../../services/listService';
import { CreateListRequest } from '../../interfaces/lists';
import './CreateList.css';

interface CreateListProps {
  onListCreated?: () => void;
}

export const CreateList = ({ onListCreated }: CreateListProps) => {
  const [listName, setListName] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_NAME_LENGTH = 50;
  const MIN_NAME_LENGTH = 3;

  const validateListName = (name: string): string => {
    if (name.length < MIN_NAME_LENGTH) {
      return `List name must be at least ${MIN_NAME_LENGTH} characters long`;
    }
    if (name.length > MAX_NAME_LENGTH) {
      return `List name cannot exceed ${MAX_NAME_LENGTH} characters`;
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateListName(listName.trim());
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data: CreateListRequest = {
        list_name: listName.trim()
      };
      await createList(data);
      setSuccess('List created successfully!');
      setListName('');
      onListCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setListName(newName);
    if (error) {
      const validationError = validateListName(newName.trim());
      setError(validationError);
    }
  };

  return (
    <div className="create-list-container">
      <form className="create-list-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="list_name">List Name</label>
          <input
            type="text"
            id="list_name"
            value={listName}
            onChange={handleNameChange}
            placeholder="Enter list name"
            maxLength={MAX_NAME_LENGTH}
            required
            aria-describedby={error ? "name-error" : undefined}
          />
          <small className="character-count">
            {listName.length}/{MAX_NAME_LENGTH} characters
          </small>
        </div>

        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !listName.trim() || !!validateListName(listName.trim())}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            'Create List'
          )}
        </button>
      </form>

      {error && <div className="error-message" id="name-error" role="alert">{error}</div>}
      {success && <div className="success-message" role="status">{success}</div>}
    </div>
  );
}; 
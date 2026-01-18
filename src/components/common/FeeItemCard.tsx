import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Edit, Trash2, Wallet } from 'lucide-react';
import { FeeItem } from '@/types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface FeeItemCardProps {
  item: FeeItem;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (id: string, data: Partial<FeeItem>) => void;
  onDelete: (id: string) => void;
}

export function FeeItemCard({ item, onToggle, onEdit, onDelete }: FeeItemCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editData, setEditData] = useState({
    label: item.label,
    description: item.description || '',
  });

  const handleSaveEdit = () => {
    onEdit(item.id, editData);
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Card className={`transition-all ${item.enabled ? 'border-primary/50 bg-primary/5' : 'opacity-60'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg ${item.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                <Wallet className={`h-5 w-5 ${item.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.label}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {item.description || 'No description'}
                </p>
              </div>
            </div>
            <Switch
              checked={item.enabled}
              onCheckedChange={(checked) => onToggle(item.id, checked)}
            />
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                setEditData({ label: item.label, description: item.description || '' });
                setIsEditOpen(true);
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-destructive hover:text-destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fee Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fee Item Name</Label>
              <Input 
                value={editData.label}
                onChange={(e) => setEditData({...editData, label: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                placeholder="Brief description of this fee"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Fee Item"
        description={`Are you sure you want to delete "${item.label}"? This action cannot be undone.`}
      />
    </>
  );
}

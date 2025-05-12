
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { clienteService } from '@/services/clienteService';
import { toast } from 'sonner';

// Definir esquema de validação
const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().min(1, 'Local é obrigatório')
});

type FormValues = z.infer<typeof formSchema>;

interface AdicionarClienteFormProps {
  onSucesso: () => void;
}

const AdicionarClienteForm: React.FC<AdicionarClienteFormProps> = ({ onSucesso }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      email: '',
      endereco: ''
    }
  });

  const onSubmit = (values: FormValues) => {
    try {
      clienteService.addCliente({
        nome: values.nome,
        telefone: values.telefone || '',
        email: values.email || '',
        endereco: values.endereco,
        cidade: 'A definir',  // Campos padrão temporários
        estado: 'SP',
        cep: '',
      });

      toast.success('Cliente adicionado com sucesso!');
      form.reset();
      onSucesso();
    } catch (error) {
      toast.error('Erro ao adicionar cliente');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local *</FormLabel>
              <FormControl>
                <Input placeholder="Endereço" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};

export default AdicionarClienteForm;
